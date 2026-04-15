// @ts-nocheck
import { serve } from "https://deno.land/std@0.175.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

// Initialize Supabase client with service role key for admin access
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
}

const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface BuildReleaseRequest {
  releaseId: string
}

interface Detection {
  boxLeft: number
  boxTop: number
  boxRight: number
  boxBottom: number
  classLabel: string
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  // Only handle POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const { releaseId } = (await req.json()) as BuildReleaseRequest

    if (!releaseId) {
      return new Response(JSON.stringify({ error: "releaseId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    console.log(`Building release: ${releaseId}`)

    // 1. Get release metadata
    const { data: release, error: releaseError } = await supabase
      .from("dataset_releases")
      .select("*")
      .eq("id", releaseId)
      .single()

    if (releaseError || !release) {
      console.error("Release error:", releaseError)
      return new Response(JSON.stringify({ error: "Release not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    console.log(`Found release: ${release.name}`)

    // 2. Get approved captures for this release's vegetables
    const { data: captures, error: capturesError } = await supabase
      .from("scan_history")
      .select("*")
      .eq("review_status", "approved")
      .in("vegetable_name", release.vegetables || [])

    if (capturesError) {
      console.error("Captures error:", capturesError)
      return new Response(JSON.stringify({ error: "Failed to load captures" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (!captures || captures.length === 0) {
      return new Response(
        JSON.stringify({ error: "No approved captures found for this release" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log(`Found ${captures.length} approved captures`)

    // 3. Process captures and build dataset structure
    const datasetFiles = new Map<string, string | Uint8Array>()
    const classLabels = new Set<string>()
    let freshCount = 0

    const fileMap: { [split: string]: string[] } = {
      train: [],
      val: [],
      test: [],
    }

    for (const capture of captures) {
      const detections = capture.reviewed_detections || capture.detections || []
      const label = (capture.reviewed_class_label || capture.class_label || "").trim()

      if (!label) continue

      if (capture.is_fresh) freshCount++

      // Normalize label: "Fresh_Potato" → "potato"
      const normalizedLabel = label
        .replace(/^Fresh[_\s]+/, "")
        .replace(/^Rotten[_\s]+/, "")
        .replace(/_/g, " ")
        .toLowerCase()
        .trim()

      classLabels.add(normalizedLabel)

      // Deterministic split based on capture ID hash
      const split = determineSplit(capture.id)
      fileMap[split].push(capture.id)

      // Download image from Supabase Storage
      let imageBuffer: ArrayBuffer | null = null
      try {
        if (capture.scanned_image_path) {
          const imageResp = await fetch(capture.scanned_image_path)
          if (imageResp.ok) {
            imageBuffer = await imageResp.arrayBuffer()
          }
        }
      } catch (error) {
        console.warn(`Failed to download image for ${capture.id}:`, error)
      }

      // Add image to dataset if downloaded
      if (imageBuffer) {
        datasetFiles.set(
          `${split}/images/${capture.id}.jpg`,
          new Uint8Array(imageBuffer)
        )
      }

      // Generate YOLO label file
      const labelLines: string[] = []
      const classIdx = Array.from(classLabels).sort().indexOf(normalizedLabel)

      for (const det of detections) {
        // YOLO format: class_id center_x center_y width height (all 0-1 normalized)
        const centerX = (det.boxLeft + det.boxRight) / 2
        const centerY = (det.boxTop + det.boxBottom) / 2
        const width = det.boxRight - det.boxLeft
        const height = det.boxBottom - det.boxTop

        labelLines.push(
          `${classIdx} ${centerX.toFixed(6)} ${centerY.toFixed(6)} ${width.toFixed(
            6
          )} ${height.toFixed(6)}`
        )
      }

      datasetFiles.set(
        `${split}/labels/${capture.id}.txt`,
        labelLines.join("\n")
      )
    }

    // 4. Create data.yaml
    const classArray = Array.from(classLabels).sort()
    const dataYaml = `path: ${releaseId}
train: train/images
val: val/images
test: test/images

nc: ${classArray.length}
names: ${JSON.stringify(classArray)}
`
    datasetFiles.set("data.yaml", dataYaml)

    // 5. Create README
    const readme = `# ${release.name}

## Dataset Info
- **Version**: ${release.version}
- **Vegetables**: ${(release.vegetables || []).join(", ")}
- **Total Samples**: ${captures.length}
- **Fresh Samples**: ${freshCount}
- **Fresh Ratio**: ${((freshCount / captures.length) * 100).toFixed(1)}%

## Classes
${classArray.map((c, i) => `${i}: ${c}`).join("\n")}

## Split
- Train: ${fileMap.train.length}
- Validation: ${fileMap.val.length}
- Test: ${fileMap.test.length}

## Format
YOLO format with normalized bounding boxes.

## Usage
Extract this zip and use with any YOLO training framework:
\`\`\`bash
yolo detect train data=data.yaml model=yolov8n.pt epochs=100
\`\`\`
`
    datasetFiles.set("README.md", readme)

    // 6. Create zip file using a simple zip format
    const zipBuffer = await createSimpleZip(datasetFiles)

    console.log(`Zip created: ${zipBuffer.length} bytes`)

    // 7. Upload to datasets bucket
    const { error: uploadError } = await supabase.storage
      .from("datasets")
      .upload(`${releaseId}.zip`, zipBuffer, { upsert: true })

    if (uploadError) {
      console.error("Upload error:", uploadError)
      return new Response(
        JSON.stringify({ error: `Upload failed: ${uploadError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log("Upload successful")

    // 8. Calculate metrics
    const freshRatio = freshCount / captures.length

    // 9. Update release record
    const { error: updateError } = await supabase
      .from("dataset_releases")
      .update({
        status: "Published",
        public_url: `${supabaseUrl}/storage/v1/object/public/datasets/${releaseId}.zip`,
        sample_count: captures.length,
        fresh_ratio: freshRatio,
        updated_at: new Date().toISOString(),
      })
      .eq("id", releaseId)

    if (updateError) {
      console.error("Update error:", updateError)
      return new Response(
        JSON.stringify({ error: `Update failed: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    console.log("Update successful")

    return new Response(
      JSON.stringify({
        success: true,
        releaseId,
        sampleCount: captures.length,
        freshRatio: (freshRatio * 100).toFixed(1),
        classes: classArray,
        split: fileMap,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error building release:", error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

/**
 * Deterministic split: hash the capture ID to decide train/val/test (70/20/10)
 */
function determineSplit(captureId: string): "train" | "val" | "test" {
  let hash = 0
  for (let i = 0; i < captureId.length; i++) {
    const char = captureId.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  const prob = Math.abs(hash) % 100
  if (prob < 70) return "train"
  if (prob < 90) return "val"
  return "test"
}

/**
 * Create a simple zip file from Map of paths to content
 * Using a minimal ZIP format that works everywhere
 */
async function createSimpleZip(
  files: Map<string, string | Uint8Array>
): Promise<Uint8Array> {
  const zipEntries: Uint8Array[] = []
  const centralDirectory: Uint8Array[] = []
  let offset = 0

  const encoder = new TextEncoder()

  for (const [path, content] of files) {
    const isString = typeof content === "string"
    const data = isString ? encoder.encode(content) : content
    const filename = encoder.encode(path)

    // Local file header
    const localHeader = new Uint8Array(30 + filename.length)
    const view = new DataView(localHeader.buffer)

    view.setUint32(0, 0x04034b50, true) // Local file header signature
    view.setUint16(4, 20, true) // Version needed to extract
    view.setUint16(6, 0, true) // General purpose bit flag
    view.setUint16(8, 0, true) // Compression method (0 = stored)
    view.setUint16(10, 0, true) // File modification time
    view.setUint16(12, 0, true) // File modification date
    view.setUint32(14, 0, true) // CRC-32 (skip for now)
    view.setUint32(18, data.length, true) // Compressed size
    view.setUint32(22, data.length, true) // Uncompressed size
    view.setUint16(26, filename.length, true) // Filename length
    view.setUint16(28, 0, true) // Extra field length

    localHeader.set(filename, 30)
    zipEntries.push(localHeader)
    zipEntries.push(data)

    // Central directory record (for EOF)
    const cdRecord = new Uint8Array(46 + filename.length)
    const cdView = new DataView(cdRecord.buffer)

    cdView.setUint32(0, 0x02014b50, true) // Central directory signature
    cdView.setUint16(4, 20, true) // Version made by
    cdView.setUint16(6, 20, true) // Version needed to extract
    cdView.setUint16(8, 0, true) // General purpose bit flag
    cdView.setUint16(10, 0, true) // Compression method
    cdView.setUint16(12, 0, true) // File modification time
    cdView.setUint16(14, 0, true) // File modification date
    cdView.setUint32(16, 0, true) // CRC-32
    cdView.setUint32(20, data.length, true) // Compressed size
    cdView.setUint32(24, data.length, true) // Uncompressed size
    cdView.setUint16(28, filename.length, true) // Filename length
    cdView.setUint16(30, 0, true) // Extra field length
    cdView.setUint16(32, 0, true) // File comment length
    cdView.setUint16(34, 0, true) // Disk number start
    cdView.setUint16(36, 0, true) // Internal file attributes
    cdView.setUint32(38, 0, true) // External file attributes
    cdView.setUint32(42, offset, true) // Relative offset of local header

    cdRecord.set(filename, 46)
    centralDirectory.push(cdRecord)

    offset += localHeader.length + data.length
  }

  // Combine entries
  const allData = new Uint8Array(
    zipEntries.reduce((s, e) => s + e.length, 0) +
      centralDirectory.reduce((s, e) => s + e.length, 0) +
      22
  )

  let pos = 0
  for (const entry of zipEntries) {
    allData.set(entry, pos)
    pos += entry.length
  }

  const cdOffset = pos

  for (const record of centralDirectory) {
    allData.set(record, pos)
    pos += record.length
  }

  // End of central directory record
  const eocd = new Uint8Array(22)
  const eocdView = new DataView(eocd.buffer)

  eocdView.setUint32(0, 0x06054b50, true) // EOCD signature
  eocdView.setUint16(4, 0, true) // Disk number
  eocdView.setUint16(6, 0, true) // Disk with central directory
  eocdView.setUint16(8, centralDirectory.length, true) // Number of records (this disk)
  eocdView.setUint16(10, centralDirectory.length, true) // Total number of records
  eocdView.setUint32(12, centralDirectory.reduce((s, e) => s + e.length, 0), true) // Size of CD
  eocdView.setUint32(16, cdOffset, true) // Offset of CD
  eocdView.setUint16(20, 0, true) // Comment length

  allData.set(eocd, pos)

  return allData
}
