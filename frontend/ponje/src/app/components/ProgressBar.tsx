import React from 'react'
import Image from 'next/image'

export const ProgressBar = () => {
    return (
        <div className='bg-[#1B1A2D] rounded-box  pt-8 pb-8 w-fit pr-6 pl-6 h-fit '>
        <div className="flex lg:flex-row">
            <img src="/rank_icon.svg" alt="hero" className="w-24 h-24 rounded-full" />
            <div className="divider lg:divider-horizontal before:bg-[#464671] after:bg-[#464671]"></div> 
            <div className='pl-4'>
                <p className='text-[#77DFF8] text-xs'>LEVEL</p>
                <div className="flex flex-col w-full lg:flex-row">
                    <p className='text-[#77DFF8] text-3xl'>12</p>
                    <div className="divider lg:divider-horizontal before:bg-secondary after:bg-secondary"></div>
                    <p className='text-[#77DFF8] text-3xl'>10020 XP</p>
                </div>
                <progress className="progress progress-primary w-60" value="40" max="100"></progress>
                <p className='text-[#baecf9] text-xs'>80 XP to level 13</p>
            </div>
        </div>
        </div>
    )
}
