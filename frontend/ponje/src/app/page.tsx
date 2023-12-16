'use client';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      <Image
        src="/edited_background.png"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="bg-cover bg-fixed max-w-screen bg-center bg-no-repeat mb-8 md:h-[350px]"
      />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <div className="relative">
            <Image
              src="/3dobject1.png"
              alt="Background Image"
              className="hidden md:block absolute top-[-100%] right-[-10%] translate-y-[10%] object-cover"
              style={{ zIndex: -1 }}
              width={400}
              height={400}
            />
            <Image
              src="/3dobject2.png"
              alt="Background Image"
              className="hidden md:block absolute left-[30%] object-cover translate-x-[30%] translate-y-[30%]"
              style={{ zIndex: -1 }}
              width={200}
              height={200}
            />
            <Image
              src="/3dobject3.png"
              alt="Foreground Image"
              className="hidden md:block absolute top-1/2 left-1/2 transform translate-x-[-250%] translate-y-[-63%]"
              style={{ zIndex: -1 }}
              width={200}
              height={200}
            />
            <h1
              className="text-mainText text-cyan-200 text-3xl md:text-4xl lg:text-7xl font-bold mb-4"
            >
              Revive the Classic,Conquer <br /> the{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #8B5CF6, #84CCE3 60%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                Pong
              </span>{' '}
              World!
            </h1>
            <p className="text-mainp text-lg md:text-xl lg:text-2xl mb-4">
              Discover the world of Pong, where classic meets modern. Engage in thrilling matches, compete with players worldwide, and experience the excitement of the game that started it all.
            </p>
          </div>
          <Link href="/sign-in" className="relative">
            <h1 className="bg-indigo-600	 text-white font-semibold text-base md:text-lg lg:text-xl px-4 py-2 rounded inline-block">
              Get Started
            </h1>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="hidden md:block md:w-22 md:h-22 absolute top-1/2 transform -translate-y-1/2 -translate-x-36"
              viewBox="0 0 140 80"
              fill="none"
              style={{ left: '-20px' }}
            >
              <path
                d="M4.39707 6.89097C-0.123978 -5.66749 4.1754 9.38049 7.08666 14.0147C30.5908 51.4295 71.8372 54.4382 111.69 56.612"
                stroke="#B9E4F2"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M97.2969 35.6768C97.5752 33.7285 101.206 37.6284 101.586 37.9303C107.456 42.592 113.34 46.8007 120.267 49.779C124.925 51.7811 129.876 53.461 134.951 53.9224C135.5 53.9723 138.751 53.8797 138.295 54.1405C128.003 60.0215 118.708 69.22 110.381 77.5472"
                stroke="#B9E4F2"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </Link>
        </div>
        <div className="absolute top-4 left-4">
          <Image
            src="/Logo.png"
            alt="PONG Logo"
            width={90}
            height={90}
            className='w-24 h-auto md:w-28 lg:w-32'
          />
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link href="/sign-in">
            <h1 className="bg-indigo-600	 text-white font-semibold text-base px-4 py-2 rounded">
              <span className="text-sm md:text-lg lg:text-xl">Login</span>
            </h1>
          </Link>
          <Link href="/sign-up">
            <h1 className="bg-transparent border border-white outline-offset-0 text-white font-light text-base px-3 py-1.5 rounded">
              <span className="text-sm md:text-lg lg:text-xl">Sign Up</span>
            </h1>
          </Link>
        </div>
    </div>
  );
}
