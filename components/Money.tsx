import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const Money = () => {
    return (
        <div className='px-60 mb-22'>

            <div className='w-full  relative  flex-col h-[310px]  p-6 rounded-xl bg-[#141414] my-6 flex'>

                <h3 className='text-xl mb-8 text-left   font-semibold'>Make Money</h3>
                <p className='text-[#8B8B8B] text-left mb-6'>Fund your account and get reading to make good cheese.</p>

                <button className="bg-white text-black absolute left-4 bottom-8  font-semibold mt-6 px-8 py-3 rounded-[50px] flex items-center gap-2">
                    Sign Up
                    <FaArrowRight className='rotate-335' />
                </button>
                <Image alt='' width={100} height={100} className=' w-[50%] absolute bottom-0 right-0  rounded-b-[20px]' src={"/img/home/ss3.svg"} />
            </div>
        </div>
    )
}

export default Money