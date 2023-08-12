import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main className="relative h-screen">
        <Image
          src="/background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1
            className="text-mainText text-4xl font-bold mb-4"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: '3.5rem',
              lineHeight: '1.3',
            }}
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

          <p className="text-mainp text-lg mb-4">
            Discover the world of Pong, where classic meets modern. Engage in thrilling matches, compete with players worldwide, and experience the excitement of the game that started it all.
          </p>
          <Link href="/sign-in">
            <h1 className="bg-logincColor text-white font-semibold text-base px-4 py-2 rounded inline-block">
              Get Started
            </h1>
          </Link>
          {/* 3D objects */}



        </div>
        <div className="absolute top-4 left-4">
          <Image
            src="/Logo.png"
            alt="PONG Logo"
            width={90}
            height={90}
          />
        </div>
        <div className="absolute top-4 right-4 flex space-x-2">
          <Link href="/sign-in">
            <h1 className="bg-logincColor text-white font-semibold text-base px-4 py-2 rounded">
              <span className="text-sm">Login</span>
            </h1>
          </Link>
          <Link href="/sign-up">
            <h1 className="bg-transparent border border-white text-white font-light text-base px-4 py-2 rounded">
              <span className="text-sm">Sign Up</span>
            </h1>
          </Link>
        </div>


      </main>
    </div>
  );
}
