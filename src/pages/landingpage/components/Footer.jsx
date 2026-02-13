import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-accent text-white relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute top-4 right-10 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-10 w-40 h-40 bg-white/3 rounded-full blur-2xl" />

      <div id="download" className="max-w-7xl mx-auto px-6 pt-12 pb-6 relative z-10">
        {/* ── CTA Row: Left content | Right phone mockup ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-start mb-8">
          {/* Left — CTA + Features + Footer info */}
          <div className="lg:col-span-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: '-60px' }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block bg-white/15 text-white/90 px-3 py-1 rounded-full text-xs font-medium mb-3">
                Available Now
              </span>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3">
                Ready to Detect Freshness?
              </h2>
              <p className="text-white/60 text-sm mb-5 leading-relaxed max-w-md">
                Download FreshLens and start making smarter decisions about 
                your vegetables. Free, offline-capable, and available on Android.
              </p>

              {/* Feature badges — on the left */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                {[
                  { label: 'Free to use', icon: '✓' },
                  { label: 'Works offline', icon: '✓' },
                  { label: 'Regular updates', icon: '✓' },
                  { label: 'Fast & accurate', icon: '✓' },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                    className="flex items-center gap-2 text-white/75 text-xs bg-white/5 rounded-lg px-3 py-2"
                  >
                    <div className="w-4 h-4 bg-white/15 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white text-[8px]">{item.icon}</span>
                    </div>
                    {item.label}
                  </motion.div>
                ))}
              </div>

              {/* Download buttons */}
              <div className="flex flex-row gap-3 mb-6">
                <a
                  href="#"
                  className="bg-primary hover:bg-primary/90 hover:scale-105 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm"
                >
                  <img src="/assets/icons/playstore.png" alt="Google Play" className="w-5 h-5" />
                  <div className="text-left">
                    <span className="text-[8px] text-white/70 block leading-none">Get it on</span>
                    <span className="text-sm leading-tight">Google Play</span>
                  </div>
                </a>
                <a
                  href="#"
                  className="bg-white/10 hover:bg-white/15 hover:scale-105 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 text-sm"
                >
                  <img src="/assets/icons/download.png" alt="Download" className="w-5 h-5 brightness-0 invert" />
                  <div className="text-left">
                    <span className="text-[8px] text-white/70 block leading-none">Direct</span>
                    <span className="text-sm leading-tight">Download APK</span>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right — Large Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: '-40px' }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-6 flex justify-center lg:mr-[-2rem]"
          >
            <div className="relative w-80 lg:w-96">
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-56 h-56 bg-white/5 rounded-full blur-3xl" />
              <div className="relative overflow-hidden rounded-t-[2rem]" style={{ height: '310px' }}>
                <div className="bg-gradient-to-b from-gray-700 to-gray-800 rounded-t-[2rem] p-2 h-full">
                  <div className="w-full h-full bg-white rounded-t-[1.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 rounded-full z-10" />
                    <div className="pt-10 px-4 h-full flex flex-col">
                      {/* Status bar */}
                      <div className="flex justify-between items-center mb-3 text-gray-400 text-[9px]">
                        <span>9:41</span>
                        <div className="flex gap-1">
                          <div className="w-3 h-1.5 bg-gray-300 rounded-sm" />
                          <div className="w-3 h-1.5 bg-gray-300 rounded-sm" />
                          <div className="w-4 h-1.5 bg-gray-400 rounded-sm" />
                        </div>
                      </div>

                      {/* App icon + title */}
                      <div className="flex gap-3 mb-3">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                          <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-13 h-13 object-contain" />
                        </div>
                        <div className="flex-1 min-w-0 pt-1">
                          <p className="font-bold text-gray-900 text-base">FreshLens</p>
                          <p className="text-primary text-xs font-medium">Bern Payot and Friends</p>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-bold text-gray-800">4.8</span>
                        <div className="flex gap-0.5">
                          {[1,2,3,4,5].map((i) => (
                            <svg key={i} className={`w-3.5 h-3.5 ${i <= 4 ? 'text-amber-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-[10px] text-gray-500">(2.4k)</span>
                      </div>

                      {/* Install button */}
                      <div className="bg-primary text-white text-center py-2.5 rounded-lg text-sm font-bold mb-4 shadow-md">
                        Install
                      </div>

                      {/* App stats */}
                      <div className="flex justify-between border-y border-gray-100 py-3">
                        {[
                          { value: '4.8★', label: 'Reviews' },
                          { value: '15 MB', label: 'Size' },
                          { value: '3+', label: 'Rated' },
                        ].map((stat) => (
                          <div key={stat.label} className="text-center">
                            <p className="text-xs font-bold text-gray-800">{stat.value}</p>
                            <p className="text-[8px] text-gray-400 mt-0.5">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Fade-out gradient at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-accent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

        {/* ── Separator Line ── */}
        <div className="border-t border-white/10 my-4" />

        {/* ── Footer Info Section (Above Copyright) ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <img src="/assets/logo/freshlens_logo.png" alt="FreshLens" className="w-7 h-7 object-contain" />
              </div>
              <span className="text-base font-bold">FreshLens</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              AI-powered vegetable freshness detection using YOLOv8 computer vision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-2 text-xs">Quick Links</h4>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/technology" className="hover:text-white transition-colors">Technology</a></li>
              <li><a href="/dataset" className="hover:text-white transition-colors">Dataset</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-2 text-xs">Contact</h4>
            <ul className="space-y-1.5 text-gray-400 text-xs">
              <li><a href="mailto:contact@freshlens.app" className="hover:text-white transition-colors">contact@freshlens.app</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GitHub Repository</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar — Copyright */}
        <div className="pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-1">
            <p className="text-gray-300 text-xs">
              © {currentYear} FreshLens. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs">
              Built with YOLOv8 · Flutter · TensorFlow Lite
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
