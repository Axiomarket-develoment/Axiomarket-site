import Image from 'next/image'
import React from 'react'

const Team = () => {
  return (
    <div className='px-60 mb-24'>
      <h2
        className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent text-center  mb-12   text-2xl font-semibold lg:text-[46px] '


      >Visionary</h2>
      <div className='space-y-24'>
        <div className='flex w-full'>
          <div className='flex gap-8 w-1/2'>
            <Image alt='Patrick' width={220} height={100} src='/img/home/pat.jpg' className='rounded-2xl' />
            <div>

              <h3 className='font-bold  text-[32px]'>Patrick</h3>
              <p
                className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent mb-2  text-xl font-semibold lg:text-[18px] '
              >
                Founder
              </p>
              <p className='text-[#8B8B8B]'>“Browse round different market of your choice from ranges of sports, entertainment, crypto, stocks, virtual games and entertainment”</p>
            </div>
          </div>
        </div>
        <div className='flex w-full justify-end'>
          <div className='flex gap-8 w-1/2'>
            <div className='text-right'>

              <h3 className='font-bold  text-[32px]'>Osita</h3>
              <p
                className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent mb-2  text-xl font-semibold lg:text-[18px] '
              >
                Product Designer
              </p>
              <p className='text-[#8B8B8B]'>“Browse round different market of your choice from ranges of sports, entertainment, crypto, stocks, virtual games and entertainment”</p>
            </div>
            <Image alt='Patrick' width={220} height={100} src='/img/home/osita.jpg' className='rounded-2xl' />
          </div>
        </div>
        <div className='flex gap-8 w-1/2'>
          <Image alt='Patrick' width={220} height={100} src='/img/home/pat.jpg' className='rounded-2xl' />
          <div>
            <h3 className='font-bold  text-[32px]'>Derik</h3>
            <p
              className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent mb-2  text-xl font-semibold lg:text-[18px] '
            >
              Lead Developer
            </p>
            <p className='text-[#8B8B8B]'>“Browse round different market of your choice from ranges of sports, entertainment, crypto, stocks, virtual games and entertainment”</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Team