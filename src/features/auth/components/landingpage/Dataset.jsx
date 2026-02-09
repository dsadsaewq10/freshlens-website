import React, { useState } from 'react'
import DownloadIcon from '@mui/icons-material/Download'
import InfoIcon from '@mui/icons-material/Info'
import ImageIcon from '@mui/icons-material/Image'
import CameraAltIcon from '@mui/icons-material/CameraAlt'
import LabelIcon from '@mui/icons-material/Label'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import StarIcon from '@mui/icons-material/Star'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'

function Dataset() {
  const getRatingIcon = (rating) => {
    switch (rating.toLowerCase()) {
      case 'poor':
        return <StarBorderIcon sx={{ fontSize: 14 }} />
      case 'fair':
        return <StarHalfIcon sx={{ fontSize: 14 }} />
      case 'good':
        return <StarIcon sx={{ fontSize: 14 }} />
      case 'excellent':
        return <WorkspacePremiumIcon sx={{ fontSize: 14 }} />
      default:
        return <StarIcon sx={{ fontSize: 14 }} />
    }
  }
  const [datasets] = useState([
    {
      id: 1,
      name: 'Cabbage Dataset',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      images: 11,
      classes: 5,
      rating: 'Excellent',
      size: '4.5 MB',
      imageUrl: null 
    },
    {
      id: 2,
      name: 'Tomato Dataset',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      images: 10,
      classes: 3,
      rating: 'Good',
      size: '4.5 MB',
      imageUrl: null
    },
    {
      id: 3,
      name: 'Carrot Dataset',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      images: 15,
      classes: 4,
      rating: 'Fair',
      size: '4.5 MB',
      imageUrl: null
    },
    {
      id: 4,
      name: 'Pepper Dataset',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      images: 20,
      classes: 5,
      rating: 'Poor',
      size: '5 MB',
      imageUrl: null
    }
  ])

  return (
    <section className="bg-offwhite py-20 px-80">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-primary mb-2">Available Datasets</h2>
        <p className="text-gray-700">Browse and download our curated vegetable freshness datasets</p>
      </div>

      <div className="flex gap-3 mb-8">
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-offwhite transition">
          All Datasets
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-offwhite transition">
          Recently Updated
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-offwhite transition">
          Most Downloaded
        </button>
        <button className="bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-semibold hover:bg-primary hover:text-offwhite transition">
          High Accuracy
        </button>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {datasets.map((dataset) => (
          <div key={dataset.id} className="bg-primary rounded-2xl p-6 text-white space-y-4 box-shadow-md">
            <h3 className="text-xl font-bold">{dataset.name}</h3>
            
            <div className="bg bg-opacity-30 rounded-xl h-40 flex flex-col items-center justify-center gap-2">
              {dataset.imageUrl ? (
                <img src={dataset.imageUrl} alt={dataset.name} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <ImageIcon sx={{ fontSize: 60 }} className="text-green-300" />
                  <span className="text-xs text-green-300">Image Placeholder</span>
                </>
              )}
            </div>

            <p className="text-sm text-green-100 leading-relaxed text-center">
              {dataset.description}
            </p>

            <div className="flex gap-1.5 text-xs items-center justify-center">
              <span className="bg-transparent bg-opacity-50 border border-greenglow px-2.5 py-1 rounded-sm flex items-center justify-center gap-1 whitespace-nowrap w-[90px]">
                <CameraAltIcon sx={{ fontSize: 14 }} /> {dataset.images} Images
              </span>
              <span className="bg-transparent bg-opacity-50 border border-greenglow px-2.5 py-1 rounded-sm flex items-center justify-center gap-1 whitespace-nowrap w-[85px]">
                <LabelIcon sx={{ fontSize: 14 }} /> {dataset.classes} Classes
              </span>
              <span className="bg-transparent bg-opacity-50 border border-greenglow px-2.5 py-1 rounded-sm flex items-center justify-center gap-1 whitespace-nowrap w-[85px]">
                {getRatingIcon(dataset.rating)} {dataset.rating}
              </span>
            </div>

            <div className="flex gap-2">
              <button className="flex-1  bg-white text-primary px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2">
                <DownloadIcon sx={{ fontSize: 18 }} /> Download ({dataset.size})
              </button>
              <button className="bg-white text-primary px-3 py-2 rounded-lg hover:bg-gray-100">
                <InfoIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Dataset