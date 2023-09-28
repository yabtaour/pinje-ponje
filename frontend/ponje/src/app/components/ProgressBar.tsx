import React from 'react'
import Image from 'next/image'

export const ProgressBar = () => {
    return (
        <div className='bg-[#1B1A2D] rounded-box  pt-8 pb-8 w-fit pr-6 pl-6 '>
        <div className="flex lg:flex-row">
            <Image
                src="/badge.png"
                alt="badge image"
                width={90}
                height={60}
                style={{paddingRight: '1rem'}}
            />
            <div className="divider lg:divider-horizontal before:bg-[#464671] after:bg-[#464671]"></div> 
            <div className='pl-4'>
                <p className='text-[#77DFF8] text-sm'>LEVEL</p>
                <div className="flex flex-col w-full lg:flex-row">
                    <p className='text-[#77DFF8] text-4xl'>12</p>
                    <div className="divider lg:divider-horizontal before:bg-secondary after:bg-secondary"></div>
                    <p className='text-[#77DFF8] text-4xl'>10020 XP</p>
                </div>
                <progress className="progress progress-primary w-60" value="40" max="100"></progress>
                <p className='text-[#baecf9] text-xs'>80 XP to level 13</p>
            </div>
        </div>
        </div>
    )
}
