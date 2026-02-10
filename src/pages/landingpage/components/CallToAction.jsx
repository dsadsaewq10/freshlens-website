import React from 'react'
import AnimatedSection from '../../../components/AnimatedSection'

function CallToAction() {
  return (
    <section id="download" className="bg-accent py-20 lg:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <AnimatedSection>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Detect Freshness?
            </h2>
            <p className="text-white/80 text-lg mb-8 leading-relaxed">
              Download FreshLens today and start making smarter decisions about 
              your vegetables. Available now for Android devices.
            </p>

            {/* Features list */}
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  {/* PLACEHOLDER: Add checkmark icon */}
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                Free to download and use
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                No account required
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                Works offline after initial setup
              </li>
              <li className="flex items-center gap-3 text-white/90">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <div className="w-3 h-3 bg-white rounded-sm" />
                </div>
                Regular model updates
              </li>
            </ul>

            {/* Download buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* PLACEHOLDER: Replace with actual Google Play badge/link */}
              <a
                href="#"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
              >
                {/* Google Play icon */}
                <img src="/assets/icons/playstore.png" alt="Google Play" className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-xs text-white/70 block">Get it on</span>
                  <span className="text-lg">Google Play</span>
                </div>
              </a>
              
              {/* PLACEHOLDER: Replace with actual APK download link */}
              <a
                href="#"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
              >
                {/* Download icon */}
                <img src="/assets/icons/download.png" alt="Download" className="w-6 h-6" />
                <div className="text-left">
                  <span className="text-xs text-white/70 block">Direct</span>
                  <span className="text-lg">Download APK</span>
                </div>
              </a>
            </div>
          </AnimatedSection>

          {/* Phone mockup placeholder */}
          <AnimatedSection delay={0.2}>
            <div className="relative flex justify-center lg:justify-end">
              {/* PLACEHOLDER: Add your Android phone mockup image here */}
              <div className="relative">
                {/* Phone frame */}
                <div className="w-72 h-145 bg-linear-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                  {/* Screen */}
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Notch */}
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-full z-10" />
                    
                    {/* App Screenshot */}
                    <img 
                      src="/assets/images/playstoreapp.png" 
                      alt="FreshLens App Screenshot" 
                      className="w-full h-full object-contain object-center" 
                    />
                  </div>
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

export default CallToAction
