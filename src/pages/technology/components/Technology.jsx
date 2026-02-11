import React, { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import Header from '../../landingpage/components/Header'

// Color palette
const COLORS = {
  primary: '#285A53',
  medium: '#3E6963',
  light: '#F5F5F5',
  darker: '#EDEDED',
  white: '#FFFFFF',
  dark: '#1B413B',
}

// Reusable icon component that renders SVG/PNG with exact color via CSS mask
function ColorIcon({ src, alt, color, className = 'w-6 h-6' }) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={className}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
        WebkitMaskPosition: 'center',
        maskImage: `url(${src})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        maskPosition: 'center',
      }}
    />
  )
}

// Technology data — Flutter replaces React Native, approachable descriptions
const technologies = [
  {
    id: 'yolov8',
    name: 'YOLOv8',
    tagline: 'Real-Time Object Detection',
    description:
      'YOLOv8 is the "eyes" of FreshLens. It scans your vegetable photo in a single pass — meaning it can identify what it sees almost instantly. Think of it as a trained expert that glances at your produce and immediately knows its condition.',
    highlights: [
      { label: 'Speed', value: '<50ms', icon: '/assets/icons/icon_speed.svg' },
      { label: 'Accuracy', value: '89%+', icon: '/assets/icons/accuracy.svg' },
      { label: 'Parameters', value: '3.2M', icon: '/assets/icons/icon_brain.svg' },
      { label: 'Input Size', value: '640px', icon: '/assets/icons/icon_input.svg' },
    ],
    details: [
      'Processes the entire image at once — no need to scan piece by piece',
      'Detects vegetables and assesses freshness in under 50 milliseconds',
      'Lightweight enough to run on everyday smartphones',
      'Recognizes multiple vegetables in a single frame simultaneously',
    ],
    logo: '/assets/icons/yolo-logo.svg',
    bgColor: COLORS.darker,
    textColor: COLORS.primary,
  },
  {
    id: 'tensorflow',
    name: 'TensorFlow',
    tagline: 'Deep Learning Framework',
    description:
      'TensorFlow is like the classroom where our AI learns. It provides the tools to show thousands of vegetable images to the model so it can gradually learn what "fresh" and "spoiled" look like — similar to how you learn to tell if fruit is ripe.',
    highlights: [
      { label: 'Training Set', value: '9,355+', icon: '/assets/icons/icon_graph.svg' },
      { label: 'Iterations', value: '100+', icon: '/assets/icons/icon_cycle.svg' },
      { label: 'Acceleration', value: 'GPU', icon: '/assets/icons/icon_rocket.svg' },
      { label: 'Version', value: '2.x', icon: '/assets/icons/icon_version.svg' },
    ],
    details: [
      'Feeds thousands of labeled images to teach the model patterns',
      'Leverages pre-learned knowledge from existing models to speed up training',
      'Automatically fine-tunes settings for the best possible accuracy',
      'Provides real-time charts so researchers can monitor learning progress',
    ],
    logo: '/assets/icons/tensorflow.png',
    bgColor: COLORS.primary,
    textColor: COLORS.white,
  },
  {
    id: 'tflite',
    name: 'TensorFlow Lite',
    tagline: 'On-Device Inference',
    description:
      'Once the AI model is trained, TensorFlow Lite shrinks it down so it fits on your phone. This means FreshLens works offline — no internet needed. Your photos never leave your device, keeping your data private.',
    highlights: [
      { label: 'Model Size', value: '<10MB', icon: '/assets/icons/icon_phone.svg' },
      { label: 'Response', value: '<100ms', icon: '/assets/icons/icon_response.svg' },
      { label: 'Offline', value: '100%', icon: '/assets/icons/offline.svg' },
      { label: 'Optimized', value: 'INT8', icon: '/assets/icons/icon_setttings.svg' },
    ],
    details: [
      'Compresses the model to under 10 MB without losing accuracy',
      'Takes advantage of your phone\'s built-in hardware for faster results',
      'Works entirely without an internet connection after initial setup',
      'Keeps all processing on your device for complete privacy',
    ],
    logo: '/assets/icons/tflite.png',
    bgColor: COLORS.light,
    textColor: COLORS.primary,
  },
  {
    id: 'python',
    name: 'Python',
    tagline: 'Training & Data Pipeline',
    description:
      'Python is the programming language that ties everything together behind the scenes. It handles collecting and organizing images, running the training process, and converting the final model for mobile use — the essential backbone of FreshLens.',
    highlights: [
      { label: 'Version', value: '3.10+', icon: '/assets/icons/icon_version.svg' },
      { label: 'Libraries', value: '15+', icon: '/assets/icons/icon_libraries.svg' },
      { label: 'Scripts', value: '20+', icon: '/assets/icons/icon_script.svg' },
      { label: 'Testing', value: 'PyTest', icon: '/assets/icons/icon_check.svg' },
    ],
    details: [
      'Prepares and cleans images using NumPy and OpenCV before training',
      'Manages the YOLOv8 training workflow through the Ultralytics library',
      'Generates visual reports and charts to evaluate model performance',
      'Automates the process of splitting data into training and testing sets',
    ],
    logo: '/assets/icons/python.png',
    bgColor: COLORS.darker,
    textColor: COLORS.primary,
  },
  {
    id: 'flutter',
    name: 'Flutter',
    tagline: 'Cross-Platform Mobile App',
    description:
      'Flutter is Google\'s toolkit for building beautiful mobile apps. It lets us create one codebase that runs smoothly on both Android and iOS devices. Combined with the on-device AI model, it delivers a fast, responsive scanning experience.',
    highlights: [
      { label: 'Platforms', value: 'Android & iOS', icon: '/assets/icons/mobile.svg' },
      { label: 'Camera', value: 'Real-time', icon: '/assets/icons/icon_camera.svg' },
      { label: 'Rendering', value: '60 FPS', icon: '/assets/icons/icons_fps.png' },
      { label: 'Language', value: 'Dart', icon: '/assets/icons/icon_libraries.svg' },
    ],
    details: [
      'Single codebase produces native apps for both Android and iOS',
      'Direct camera integration for instant capture and scanning',
      'Works offline with the AI model running right on your phone',
      'Smooth, native-feeling animations at 60 frames per second',
    ],
    logo: '/assets/icons/icon_flutter.svg',
    bgColor: COLORS.primary,
    textColor: COLORS.white,
  },
]

// Pipeline steps
const pipelineSteps = [
  { label: 'Capture', desc: 'Phone camera captures the image', icon: '/assets/icons/icon_camera.svg' },
  { label: 'Preprocess', desc: 'Resize and prepare for analysis', icon: '/assets/icons/icon_wrench.svg' },
  { label: 'Detect', desc: 'YOLOv8 identifies the vegetable', icon: '/assets/icons/icon_brain.svg' },
  { label: 'Classify', desc: 'Determine freshness level', icon: '/assets/icons/icon_tag.svg' },
  { label: 'Display', desc: 'Show results to the user', icon: '/assets/icons/icon_result.svg' },
]

// Hero section (only plays on mount)
function HeroSection() {
  return (
    <section
      className="min-h-screen flex items-center justify-center relative overflow-hidden snap-start"
      style={{ background: COLORS.light }}
    >
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(${COLORS.primary} 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-5"
              style={{ background: `${COLORS.primary}15`, color: COLORS.primary }}
            >
              Technology Stack
            </motion.span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight" style={{ color: COLORS.primary }}>
              The Science Behind{' '}
              <span style={{ color: COLORS.medium }}>FreshLens</span>
            </h1>
            <p className="text-lg text-gray-600 mb-6 leading-relaxed max-w-lg">
              Explore the AI and computer vision technologies that power
              real-time vegetable freshness detection — from how the model learns
              to how it works on your phone.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {['YOLOv8', 'TensorFlow', 'TF Lite', 'Python', 'Flutter'].map(
                (tag, i) => (
                  <motion.span
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                    className="px-4 py-2 rounded-lg text-sm font-medium border"
                    style={{
                      borderColor: `${COLORS.primary}30`,
                      color: COLORS.primary,
                      background: COLORS.white,
                    }}
                  >
                    {tag}
                  </motion.span>
                )
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-7 border border-gray-100">
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-5" style={{ color: COLORS.medium }}>
                  Detection Pipeline
                </h3>
                <div className="space-y-0.5">
                  {pipelineSteps.map((step, i) => (
                    <motion.div
                      key={step.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
                    >
                      <div className="flex items-center gap-4 py-2.5">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg shrink-0"
                          style={{ background: `${COLORS.primary}10` }}
                        >
                          <ColorIcon src={step.icon} alt={step.label} color={COLORS.primary} className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm" style={{ color: COLORS.primary }}>
                            {step.label}
                          </p>
                          <p className="text-xs text-gray-500">{step.desc}</p>
                        </div>
                        <div className="text-xs font-mono px-2 py-1 rounded" style={{ background: `${COLORS.medium}15`, color: COLORS.medium }}>
                          Step {i + 1}
                        </div>
                      </div>
                      {i < pipelineSteps.length - 1 && (
                        <div className="ml-6 h-3 border-l-2 border-dashed" style={{ borderColor: `${COLORS.primary}25` }} />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-xs font-medium" style={{ color: COLORS.medium }}>Scroll to explore</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <svg className="w-5 h-5" style={{ color: COLORS.primary }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

// Technology section — animations replay on every viewport entry
function TechSection({ tech, index }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.25 })
  const isEven = index % 2 === 0

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: tech.bgColor }}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-24 -right-24 w-80 h-80 rounded-full opacity-[0.04]"
          style={{ background: tech.textColor === COLORS.white ? COLORS.white : COLORS.primary }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full opacity-[0.04]"
          style={{ background: tech.textColor === COLORS.white ? COLORS.white : COLORS.primary }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 w-full relative z-10">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${!isEven ? 'lg:[direction:rtl]' : ''}`}>
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={!isEven ? 'lg:[direction:ltr]' : ''}
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
              style={{
                background: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.15)' : `${COLORS.primary}12`,
                color: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.8)' : COLORS.medium,
              }}
            >
              {tech.tagline}
            </motion.span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: tech.textColor }}>
              {tech.name}
            </h2>
            <p
              className="text-base md:text-lg mb-6 leading-relaxed"
              style={{ color: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.8)' : '#666' }}
            >
              {tech.description}
            </p>

            <div className="space-y-2.5">
              {tech.details.map((detail, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
                  className="flex items-start gap-3"
                >
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                    style={{
                      background: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.2)' : `${COLORS.primary}15`,
                    }}
                  >
                    <svg className="w-3 h-3" style={{ color: tech.textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.75)' : '#555' }}
                  >
                    {detail}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Stats card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
            className={!isEven ? 'lg:[direction:ltr]' : ''}
          >
            <div
              className="rounded-2xl p-7 shadow-2xl"
              style={{
                background: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.08)' : COLORS.white,
                border: tech.textColor === COLORS.white ? '1px solid rgba(255,255,255,0.12)' : '1px solid #e5e7eb',
              }}
            >
              <div className="flex items-center justify-center mb-6">
                {tech.logo ? (
                  <motion.img
                    src={tech.logo}
                    alt={`${tech.name} logo`}
                    className="w-20 h-20 object-contain"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                ) : (
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.1)' : `${COLORS.primary}10`,
                    }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <img src="/assets/icons/icon_flutter.svg" alt="Flutter" className="w-12 h-12" />
                  </motion.div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {tech.highlights.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                    className="rounded-xl p-3.5 text-center"
                    style={{
                      background: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.06)' : `${COLORS.primary}06`,
                      border: tech.textColor === COLORS.white ? '1px solid rgba(255,255,255,0.08)' : '1px solid #f0f0f0',
                    }}
                  >
                    <ColorIcon src={stat.icon} alt={stat.label} color={tech.textColor === COLORS.white ? COLORS.white : COLORS.primary} className="w-6 h-6 mx-auto mb-0.5" />
                    <p className="text-xl font-bold" style={{ color: tech.textColor }}>
                      {stat.value}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: tech.textColor === COLORS.white ? 'rgba(255,255,255,0.6)' : '#888' }}
                    >
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Architecture section — animations replay
function ArchitectureSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })

  const layers = [
    { name: 'Mobile App Layer', items: ['Flutter', 'Camera API', 'UI Components'], color: COLORS.light, textColor: COLORS.primary },
    { name: 'Inference Layer', items: ['TFLite Runtime', 'Model Interpreter', 'Post-processing'], color: COLORS.medium, textColor: COLORS.white },
    { name: 'Model Layer', items: ['YOLOv8 Architecture', 'Trained Weights', 'Class Mapping'], color: COLORS.primary, textColor: COLORS.white },
    { name: 'Training Layer', items: ['TensorFlow', 'Python Scripts', 'Dataset Pipeline'], color: COLORS.dark, textColor: COLORS.white },
  ]

  return (
    <section
      ref={ref}
      className="min-h-screen flex items-center snap-start relative overflow-hidden"
      style={{ background: COLORS.light }}
    >
      <div className="max-w-6xl mx-auto px-6 py-16 w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
            style={{ background: `${COLORS.primary}12`, color: COLORS.primary }}
          >
            System Architecture
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3" style={{ color: COLORS.primary }}>
            How It All Fits Together
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            FreshLens is built in layers — each technology handles a specific job,
            from capturing images to delivering freshness results on your screen.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-3">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.6 }}
              className="rounded-2xl p-5 md:p-7"
              style={{ background: layer.color, border: layer.color === COLORS.light ? '1px solid #e5e7eb' : 'none' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold mb-1" style={{ color: layer.textColor }}>
                    {layer.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {layer.items.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1 rounded-lg text-xs font-medium"
                        style={{
                          background: layer.textColor === COLORS.white ? 'rgba(255,255,255,0.15)' : `${COLORS.primary}10`,
                          color: layer.textColor === COLORS.white ? 'rgba(255,255,255,0.85)' : COLORS.primary,
                        }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                {i < layers.length - 1 && (
                  <div className="hidden md:flex items-center">
                    <svg className="w-6 h-6 rotate-90 md:rotate-0" style={{ color: layer.textColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Main Technology Page
export default function TechnologyPage() {
  useEffect(() => {
    const html = document.documentElement
    html.style.scrollSnapType = 'y mandatory'
    html.style.overflowY = 'scroll'
    html.style.scrollBehavior = 'smooth'
    window.scrollTo(0, 0)
    return () => {
      html.style.scrollSnapType = ''
      html.style.overflowY = ''
      html.style.scrollBehavior = ''
    }
  }, [])

  return (
    <div className="bg-background">
      <Header currentPage="technology" />
      <HeroSection />
      {technologies.map((tech, index) => (
        <TechSection key={tech.id} tech={tech} index={index} />
      ))}
      <ArchitectureSection />
    </div>
  )
}
