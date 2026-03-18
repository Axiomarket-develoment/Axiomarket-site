import { adventure } from '@/data/Aventure'
import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const Aventure = () => {
    return (
        <div className='flex mb-32 px-60 w-full  flex-col items-center mt-26 text-center justify-center '>
            <div className='flex items-center'>
                <h2
                    className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent text-center  text-2xl font-semibold lg:text-[46px] '

                >Aventure For
                </h2>
                <span className='text-[46px] text-[#56CD00] font-semibold ml-4'>Everyone</span>
            </div>
            <p className='text-[#8B8B8B] mb-12 text-xl '>Pick what market you feel most comfortable to predict and win</p>

            <div className='flex w-full gap-6'>
                {adventure.map((item) => (
                    <div
                        className='bg-[#141414] p-8 rounded-xl flex flex-col items-start relative w-full'
                        key={item.topic}
                    >
                        <h3 className='text-xl mb-4 text-left font-semibold'>{item.text}</h3>
                        <p className='text-[#8B8B8B] text-left mb-6'>{item.subtext}</p>
                        <p className='text-[#8B8B8B] mb-2'>{item.minitext}</p>
                        <p className='text-[#8B8B8B] mb-6'>{item.minitext2}</p>

                        <Image
                            className="absolute rounded-br-xl bottom-0 right-0"
                            width={300}
                            height={100}
                            alt=""
                            src={item.image}
                        />

                        <button className="bg-white text-black  font-semibold mt-6 px-8 py-3 rounded-[50px] flex items-center gap-2">
                            Predict
                            <FaArrowRight className='rotate-335' />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Aventure