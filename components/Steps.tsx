import Image from 'next/image'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

const Steps = () => {
    return (
        <div className='flex mb-32 px-60 w-full  flex-col items-center mt-26 text-center justify-center '>
            <div className='flex flex-col items-center'>
                <span className='text-[46px] text-[#56CD00] font-semibold ml-4'>Everyone</span>
                <h2
                    className='bg-gradient-to-r from-[#343434] via-[#505050] to-[#8B8B8B] 
            bg-clip-text text-transparent text-center  text-2xl font-semibold lg:text-[46px] '

                >in 3 Simple Steps
                </h2>
            </div>


            <div className='w-full mt-12 justify-between flex gap-6 flex-col'>
                <div className='flex w-full gap-6'>

                    <div className='w-full  rounded-[20px] bg-[#141414]'>
                        <h3 className=' mb-4 px-6 pt-6 text-3xl text-left rounded font-semibold'>FInd a market</h3>
                        <p className='text-[#8B8B8B] text-left px-6 mb-6'>Browse round different market of your choice from ranges of sports, entertainment, crypto, stocks, virtual games and entertainment</p>
                        <Image alt='' width={100} height={100} className='w-full rounded-b-[20px]' src={"/img/home/ss1.svg"} />
                    </div>
                    <div className='w-full rounded-[20px] flex relative flex-col-reverse bg-[#141414]'>
                        <p className='text-[#8B8B8B] text-left px-6 mb-6'>Cross your I’s and dot your T’s before you make a prediction. We also have an in-built AI to assist in making predictions</p>
                        <h3 className='text-xl mb-6 text-left font-semibold px-6 '>Make Your Analysis</h3>
                        <Image alt='' width={100} height={100} className='w-full absolute top-0 rounded-t-[20px]' src={"/img/home/ss2.svg"} />
                    </div>
                </div>
                <div className='w-full relative flex-col h-[410px]  p-6 rounded-xl bg-[#141414] my-6 flex'>

                    <h3 className='text-xl mb-4 text-left   font-semibold'>3. Win or Learn</h3>
                    <p className='text-[#8B8B8B] text-left mb-6'>Once you decide which market you want to enter and you’ve taken <br /> your analysis, make your prediction and make good fortune</p>

                    <button className="bg-white text-black absolute left-4 bottom-8  font-semibold mt-6 px-8 py-3 rounded-[50px] flex items-center gap-2">
                        Predict
                        <FaArrowRight className='rotate-335' />
                    </button>
                    <Image alt='' width={100} height={100} className=' w-[70%] absolute bottom-0 right-0  rounded-b-[20px]' src={"/img/home/ss3.svg"} />
                </div>
            </div>
        </div>
    )
}

export default Steps