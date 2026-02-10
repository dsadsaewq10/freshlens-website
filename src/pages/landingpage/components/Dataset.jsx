import React from 'react'
import { motion } from 'framer-motion'
import AnimatedSection from '../../../components/AnimatedSection'

function Dataset() {
  // Dataset statistics - update these with actual values
  const stats = [
    { value: '9,355+', label: 'Total Images', description: 'Annotated samples' },
    { value: '4', label: 'Vegetable Types', description: 'Carrot, Tomato, Cabbage, Pepper' },
    { value: '3-5', label: 'Freshness Classes', description: 'Per vegetable type' },
    { value: '100%', label: 'Open Source', description: 'Free to use' }
  ]

  // Model versions - update with actual version numbers
  const modelVersions = [
    {
      name: 'YOLOv8',
      version: 'v8.x.x', // PLACEHOLDER: Add actual version
      description: 'Object detection model for real-time inference',
      badge: 'Primary',
      logo: '/assets/icons/yolo-logo.svg'
    },
    {
      name: 'TensorFlow',
      version: 'v2.x.x', // PLACEHOLDER: Add actual version
      description: 'Deep learning framework for model training',
      badge: 'Framework',
      logo: '/assets/icons/tensorflow.png'
    },
    {
      name: 'TFLite',
      version: 'v2.x.x', // PLACEHOLDER: Add actual version
      description: 'Lightweight model for mobile deployment',
      badge: 'Mobile',
      logo: '/assets/icons/tflite.png'
    },
    {
      name: 'Python',
      version: '3.x.x', // PLACEHOLDER: Add actual version
      description: 'Programming environment for training scripts',
      badge: 'Runtime',
      logo: '/assets/icons/python.png'
    }
  ]

  // Individual datasets - update with actual data
  const datasets = [
    {
      name: 'Cabbage Dataset',
      images: 'X,XXX', // PLACEHOLDER: Add actual count
      classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Severe Decay', 'Spoiled'],
      format: 'YOLO Format',
      size: 'XX MB', // PLACEHOLDER: Add actual size
      image: '/assets/icons/cabbage.webp'
    },
    {
      name: 'Tomato Dataset',
      images: 'X,XXX', // PLACEHOLDER: Add actual count
      classes: ['Fresh', 'Half Fresh', 'Spoiled'],
      format: 'YOLO Format',
      size: 'XX MB', // PLACEHOLDER: Add actual size
      image: '/assets/icons/tomato.png'
    },
    {
      name: 'Carrot Dataset',
      images: 'X,XXX', // PLACEHOLDER: Add actual count
      classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Spoiled'],
      format: 'YOLO Format',
      size: 'XX MB', // PLACEHOLDER: Add actual size
      image: '/assets/icons/carrot.png'
    },
    {
      name: 'Pepper Dataset',
      images: 'X,XXX', // PLACEHOLDER: Add actual count
      classes: ['Fresh', 'Mild Decay', 'Moderate Decay', 'Severe Decay', 'Spoiled'],
      format: 'YOLO Format',
      size: 'XX MB', // PLACEHOLDER: Add actual size
      image: '/assets/icons/pepper.png'
    }
  ]

  // Contribution steps
  const contributionSteps = [
    {
      step: '01',
      title: 'Capture Images',
      description: 'Take clear photos of vegetables at various freshness stages using your smartphone or camera.'
    },
    {
      step: '02',
      title: 'Label & Annotate',
      description: 'Use our annotation guidelines to properly label the freshness class for each image.'
    },
    {
      step: '03',
      title: 'Submit via GitHub',
      description: 'Fork our repository, add your images to the appropriate folder, and submit a pull request.'
    },
    {
      step: '04',
      title: 'Review & Merge',
      description: 'Our team reviews submissions for quality and merges approved contributions.'
    }
  ]

  return (
    <section id="dataset" className="bg-white py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            Open Source
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-accent mb-4">
            Dataset Collection
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Access our curated vegetable freshness datasets for research, 
            education, and development. Completely free and open source.
          </p>
        </AnimatedSection>


        {/* Open Source Banner */}
        <AnimatedSection delay={0.2}>
          <div className="bg-primary rounded-2xl p-8 mb-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                  Free & Open Source
                </h3>
                <p className="text-white/80 mb-6 leading-relaxed">
                  We believe in open science. Our datasets are freely available 
                  for researchers, students, and developers. Use them to train 
                  your own models, validate research, or build innovative applications.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#" // PLACEHOLDER: Add download link
                    className="bg-white text-primary px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors inline-flex items-center gap-2"
                  >
                    {/* PLACEHOLDER: Add download icon */}
                    <span>Download Dataset</span>
                  </a>
                  <a
                    href="#" // PLACEHOLDER: Add GitHub link
                    className="border-2 border-white text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors inline-flex items-center gap-2"
                  >
                    {/* PLACEHOLDER: Add GitHub icon */}
                    <span>View on GitHub</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/60 text-sm mb-1">License</p>
                  <p className="text-white font-semibold">MIT / CC BY 4.0</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/60 text-sm mb-1">Format</p>
                  <p className="text-white font-semibold">YOLO / COCO</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/60 text-sm mb-1">Resolution</p>
                  <p className="text-white font-semibold">640 x 640</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <p className="text-white/60 text-sm mb-1">Last Updated</p>
                  <p className="text-white font-semibold">2026</p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
          
      
        
        
      </div>
    </section>
  )
}

export default Dataset