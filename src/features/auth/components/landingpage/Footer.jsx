import React from 'react'

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-accent text-white py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              {/* PLACEHOLDER: Add your logo here */}
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <span className="text-2xl font-bold">FreshLens</span>
            </div>
            <p className="text-gray-300 max-w-md">
              A YOLOv8-based computer vision system for accurate vegetable 
              freshness classification. Empowering smarter decisions in 
              food quality assessment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-primary transition-colors">
                  Technology
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-primary transition-colors">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#download" className="hover:text-primary transition-colors">
                  Download
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                {/* PLACEHOLDER: Add your email */}
                <a href="mailto:contact@freshlens.app" className="hover:text-primary transition-colors">
                  contact@freshlens.app
                </a>
              </li>
              <li>
                {/* PLACEHOLDER: Add your GitHub link */}
                <a href="#" className="hover:text-primary transition-colors">
                  GitHub Repository
                </a>
              </li>
              <li>
                {/* PLACEHOLDER: Add documentation link */}
                <a href="#" className="hover:text-primary transition-colors">
                  Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {currentYear} FreshLens. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Built with YOLOv8 Computer Vision Technology
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
