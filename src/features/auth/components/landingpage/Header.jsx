import React from 'react' 
function Header() {
  return (
    <nav id='header' className='sticky top-0 w-full h-16 bg-transparent backdrop-blur-md text-offwhite flex items-center justify-between px-80 z-50'>
      <div className='text-lg font-bold font-inter'>
        <img src="/logo.png" alt="FreshLens Logo" className='inline-block w-8 h-8 mr-2' />
        <a href="#"><span className='text-2xl text-blackshade'>FreshLens</span></a>
      </div>
      <div className='flex gap-6 items-center'>
        <a href="#datasets" className='text-primary hover:text-gray-300'>Datasets</a>
        <a href="#documentation" className='text-primary hover:text-gray-300'>Documentation</a>
        <a href="#community" className='text-primary hover:text-gray-300'>Community</a>
        <a href="#contribute" className='text-primary hover:text-gray-300'>Contribute</a>
        <button className='bg-offwhite text-blackshade border-primary border px-4 py-2 rounded hover:bg-yellow-200'>
          Star on GitHub
        </button>
      </div>
    </nav>
  )
}

export default Header;
