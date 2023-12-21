"use client";
import React from 'react';
import Image from 'next/image';

export default function Rules() {

  return (
    <>
      <div className='bg-[#26243f] text-[#C6BCBC] md:w-3/5 lg:w-3/4 p-4 mb-4 rounded-lg'>
        <div>
            <>
              <div>
                <div className="badge badge-secondary badge-outline mb-3">Rules</div>
                <div className="flex items-center justify-between">
                  <p className="flex-1 text-base">
                    Move your paddle using the arrow keys to hit the ball back and forth. Score when the ball passes your opponent&apos;s paddle. First to 11 points wins!
                  </p>

                  <Image
                    src="/pong.gif"
                    alt="pong gif"
                    width={10}
                    height={10}
                    quality={100}
                    className='rounded-lg w-14  md:w-24 lg:w-36 '
                  />
                </div>
              </div>
            </>
        </div>
      </div>
    </>
  );
}
