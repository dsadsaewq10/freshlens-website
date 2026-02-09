import React from 'react'
import Header from '../components/landingpage/Header'
import Hero from '../components/landingpage/Hero'
import Features from '../components/landingpage/Features'
function Landingpage() {
  return (
    <div className='bg-white min-h-screen'>
      <Header />
      <Hero />
      <Features />
    </div>
  )
}

export default Landingpage