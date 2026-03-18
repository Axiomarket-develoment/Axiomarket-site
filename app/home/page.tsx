import Aventure from '@/components/Aventure'
import CookieConsent from '@/components/CookieConsent'
import Footer from '@/components/Footer'
import Money from '@/components/Money'
import Navbar from '@/components/Navbar'
import Steps from '@/components/Steps'
import Team from '@/components/Team'
import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='mb-40'>
      <Navbar />
      <CookieConsent />
      <div className='flex flex-col items-center'>
        <h2
          className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent text-center mt-12 text-2xl font-semibold lg:text-[96px] '
        >The Future <br /> of prediction market <br /> is human + AI
        </h2>

        <p className='text-center text-[#8B8B8B]  my-4 text-xl'>We provide you the platform, you predict the outcome</p>
        <div className="relative mt-12">
          <button
            className="px-6 py-2 rounded-lg text-[20px] font-medium text-white transition"
            style={{
              border: "1px solid transparent",
              background:
                "linear-gradient(#0D0D0D, #0D0D0D) padding-box, linear-gradient(90deg, #56CD00 0%, #FFFFFF 49.8%, #56CD00 100%) border-box",
              boxShadow: "0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(255,255,255,0.15)"
            }}
          >
            Join The Community
          </button>
        </div>

      </div>
      <Aventure />
      <Steps />

      <Team />
      <Money />
      <Footer />
    </div>
  )
}

export default page