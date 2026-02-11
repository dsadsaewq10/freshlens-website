import React from 'react'

/**
 * Per-section scanning line.
 * Renders a horizontal line that sweeps top→bottom within its parent section,
 * then loops back to the top of the SAME section. Parent must have
 * `position: relative` and `overflow: hidden`.
 *
 * @param {number} duration – animation duration in seconds (default 6)
 * @param {boolean} light  – true for light-colored sections (green line),
 *                           false for dark/primary sections (white line)
 */
function SectionScanLine({ duration = 6, light = true }) {
  return (
    <div
      aria-hidden="true"
      className="section-scan-line"
      style={{
        '--scan-duration': `${duration}s`,
        '--scan-color': light
          ? 'rgba(40, 90, 83, 0.13)'
          : 'rgba(255, 255, 255, 0.10)',
      }}
    />
  )
}

export default SectionScanLine
