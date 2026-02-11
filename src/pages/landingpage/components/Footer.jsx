import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-primary text-white relative overflow-hidden">
      {/* Download / CTA Section with Phone Mockup */}
      <div id="download" className="py-20 lg:py-28 relative">
        {/* Background decorative circles */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-10 w-56 h-56 bg-white/5 rounded-full blur-2xl" />

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-80px' }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block bg-white/15 text-white/90 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
                Available Now
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Ready to Detect Freshness?
              </h2>
              <p className="text-white/70 text-lg mb-8 leading-relaxed max-w-md">
                Download FreshLens and start making smarter decisions about 
                your vegetables. Free, offline-capable, and available on Android.
              </p>

              {/* Quick features */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { label: 'Free to use', icon: '✓' },
                  { label: 'Works offline', icon: '✓' },
                  { label: 'Regular updates', icon: '✓' },
                  { label: 'Fast & accurate', icon: '✓' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <div className="w-5 h-5 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-xs">{item.icon}</span>
                    </div>
                    {item.label}
                  </motion.div>
                ))}
              </div>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="#"
                  className="bg-accent hover:bg-accent/90 hover:scale-105 text-white px-7 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <img src="/assets/icons/playstore.png" alt="Google Play" className="w-5 h-5" />
                  <div className="text-left">
                    <span className="text-[10px] text-white/70 block leading-none">Get it on</span>
                    <span className="text-base leading-tight">Google Play</span>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/15 hover:scale-105 border border-white/20 text-white px-7 py-3.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-3"
                >
                  <img src="/assets/icons/download.png" alt="Download" className="w-5 h-5 brightness-0 invert" />
                  <div className="text-left">
                    <span className="text-[10px] text-white/70 block leading-none">Direct</span>
                    <span className="text-base leading-tight">Download APK</span>
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Right - Half Phone Mockup showing Play Store */}
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-80 lg:w-96">
                {/* Glow behind phone */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

                {/* Phone frame - large, clipped at bottom */}
                <div className="relative overflow-hidden rounded-t-[2.5rem]" style={{ height: '520px' }}>
                  <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-t-[2.5rem] p-2 h-full">
                    {/* Screen */}
                    <div className="w-full h-full bg-white rounded-t-[2rem] overflow-hidden relative">
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-900 rounded-full z-10" />

                      {/* Play Store Content */}
                      <div className="pt-10 px-4 h-full">
                        {/* Status bar */}
                        <div className="flex justify-between items-center mb-4 text-gray-400 text-[10px]">
                          <span>9:41</span>
                          <div className="flex gap-1">
                            <div className="w-3 h-1.5 bg-gray-300 rounded-sm" />
                            <div className="w-3 h-1.5 bg-gray-300 rounded-sm" />
                            <div className="w-5 h-2 bg-gray-400 rounded-sm" />
                          </div>
                        </div>

                        {/* Play Store header */}
                        <div className="flex items-center gap-2 mb-4">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                          <div className="flex-1 bg-gray-100 rounded-full px-3 py-1.5 text-[10px] text-gray-400">
                            FreshLens
                          </div>
                        </div>

                        {/* App info */}
                        <div className="flex gap-3 mb-4">
                          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                            <span className="text-white font-bold text-xl">F</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm">FreshLens</p>
                            <p className="text-primary text-[10px]">FreshLens Team</p>
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-gray-600">4.8</span>
                              <div className="flex">
                                {[1,2,3,4,5].map((i) => (
                                  <svg key={i} className={`w-2.5 h-2.5 ${i <= 4 ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-[9px] text-gray-400">1K+</span>
                            </div>
                          </div>
                        </div>

                        {/* Install button */}
                        <div className="bg-primary text-white text-center py-2 rounded-lg text-sm font-medium mb-4">
                          Install
                        </div>

                        {/* App stats */}
                        <div className="flex justify-between border-y border-gray-100 py-3 mb-4">
                          {[
                            { value: '4.8★', label: 'Reviews' },
                            { value: '15MB', label: 'Size' },
                            { value: '3+', label: 'Age' },
                          ].map((stat) => (
                            <div key={stat.label} className="text-center">
                              <p className="text-xs font-semibold text-gray-800">{stat.value}</p>
                              <p className="text-[9px] text-gray-400">{stat.label}</p>
                            </div>
                          ))}
                        </div>

                        {/* Screenshots preview row */}
                        <div>
                          <p className="text-xs font-semibold text-gray-700 mb-2">Screenshots</p>
                          <div className="flex gap-2">
                            <div className="w-16 h-28 bg-primary/10 rounded-lg flex items-center justify-center">
                              <img src="/assets/icons/scan.svg" alt="" className="w-6 h-6 opacity-40" />
                            </div>
                            <div className="w-16 h-28 bg-primary/10 rounded-lg flex items-center justify-center">
                              <img src="/assets/icons/accuracy.svg" alt="" className="w-6 h-6 opacity-40" />
                            </div>
                            <div className="w-16 h-28 bg-primary/10 rounded-lg flex items-center justify-center">
                              <img src="/assets/icons/realtime.svg" alt="" className="w-6 h-6 opacity-40" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fade-out gradient at the bottom — smaller for larger phone */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-primary to-transparent pointer-events-none" />

                {/* Decorative glow elements */}
                <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-20 -left-6 w-16 h-16 bg-white/5 rounded-full blur-xl" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">F</span>
                </div>
                <span className="text-2xl font-bold">FreshLens</span>
              </div>
              <p className="text-gray-400 max-w-md text-sm leading-relaxed">
                AI-powered vegetable freshness detection using YOLOv8 computer vision. 
                Empowering smarter decisions in food quality assessment.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h4 className="font-semibold mb-4 text-sm">Quick Links</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-white hover:translate-x-1 transition-all inline-block">Features</a></li>
                <li><a href="/technology" className="hover:text-white hover:translate-x-1 transition-all inline-block">Technology</a></li>
                <li><a href="/dataset" className="hover:text-white hover:translate-x-1 transition-all inline-block">Dataset</a></li>
              </ul>
            </motion.div>

            {/* Contact */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h4 className="font-semibold mb-4 text-sm">Contact</h4>
              <ul className="space-y-2.5 text-gray-400 text-sm">
                <li><a href="mailto:contact@freshlens.app" className="hover:text-white hover:translate-x-1 transition-all inline-block">contact@freshlens.app</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">GitHub Repository</a></li>
                <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all inline-block">Documentation</a></li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="border-t border-white/10 pt-6"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-xs">
                © {currentYear} FreshLens. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs">
                Built with YOLOv8 · Flutter · TensorFlow Lite
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
