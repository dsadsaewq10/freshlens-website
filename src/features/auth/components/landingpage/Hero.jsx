import React from 'react'
import AssessmentIcon from '@mui/icons-material/Assessment'
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary'
import LabelIcon from '@mui/icons-material/Label'
import GavelIcon from '@mui/icons-material/Gavel'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import MovieIcon from '@mui/icons-material/Movie'

function Hero() {
  return (
    <section className="bg-offwhite min-h-screen flex items-center px-80">
      <div className="w-full grid grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <div className='border-b border-primary border-shadow-md pb-4 mb-6'>
            <h1 className="text-5xl font-bold leading-tight">
              Open <span className="text-primary">Vegetable <br/> Freshness</span> Datasets
            </h1>
          </div>
          <p className="text-gray-800 text-lg">
            High-quality, annotated image datasets for training freshness detection models. 
            Free for research and commercial use under CC BY 4.0 license.
          </p>

          {/* Stats Badges Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary text-offwhite px-6 py-4 rounded-lg flex items-center gap-3">
              <AssessmentIcon sx={{ fontSize: 28 }} />
              <span className="text-lg font-semibold">6 Datasets</span>
            </div>
            <div className="bg-primary text-offwhite px-6 py-4 rounded-lg flex items-center gap-3">
              <PhotoLibraryIcon sx={{ fontSize: 28 }} />
              <span className="text-lg font-semibold">9,355 Images</span>
            </div>
            <div className="bg-primary text-offwhite px-6 py-4 rounded-lg flex items-center gap-3">
              <LabelIcon sx={{ fontSize: 28 }} />
              <span className="text-lg font-semibold">3-5 Classes</span>
            </div>
            <div className="bg-primary text-offwhite px-6 py-4 rounded-lg flex items-center gap-3">
              <GavelIcon sx={{ fontSize: 28 }} />
              <span className="text-lg font-semibold">CC BY 4.0 License</span>
            </div>
          </div>


          <div className="flex gap-4">
            <button className="bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 flex items-center gap-2">
              <FolderOpenIcon sx={{ fontSize: 20 }} /> Browse Datasets
            </button>
            <button className="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary hover:text-offwhite transition">
              <MenuBookIcon sx={{ fontSize: 20 }} /> View Documentation
            </button>
          </div>

          <div className="flex gap-9 pt-6 border-t border-gray-300">
            <div className='border-r-2 border-primary pr-6'>
              <div className="text-3xl font-bold text-primary">2,355</div>
              <div className="text-sm text-gray-600">TOTAL IMAGES</div>
            </div>
            <div className='border-r-2 border-primary pr-6'>
              <div className="text-3xl font-bold text-primary">12</div>
              <div className="text-sm text-gray-600">VEGETABLE TYPES</div>
            </div>
            <div className='border-r-2 border-primary pr-6'>
              <div className="text-3xl font-bold text-primary">89%</div>
              <div className="text-sm text-gray-600">AVG ACCURACY</div>
            </div>
            <div className='border-r-2 border-primary pr-6'>
              <div className="text-3xl font-bold text-primary">1.2K+</div>
              <div className="text-sm text-gray-600">DOWNLOADS</div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-linear-to-br from-green-100 to-green-300 rounded-3xl h-125 flex items-center justify-center shadow-2xl">
            <div className="text-center space-y-4 text-gray-600">
              <MovieIcon sx={{ fontSize: 80 }} className="text-gray-600" />
              <p className="text-xl font-semibold">GIF / Carousel Placeholder</p>
              <p className="text-sm">Add your animated content here</p>
            </div>
          </div>
          <div className="flex justify-center">
            <button className="bg-primary text-offwhite px-10 py-4 rounded-lg font-semibold hover:bg-opacity-90 flex items-center gap-2">
               SCAN NOW!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero