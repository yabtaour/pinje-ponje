import Image from 'next/image'
import Link from 'next/link';

// export default function Home() {
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-between p-0">
      

      
//       <div className="flex flex-col items-center justify-center h-screen w-screen relative p-0">
//         <Image
//           src="/background.png"
//           alt="Background Image"
//           layout="fill"
//           objectFit="cover"
//           quality={100}
//         />
//       <nav className="flex justify-between items-center px-4 py-2 bg-transparent">
//           <div className="flex items-center">
//             <h1 className="text-white font-bold text-xl">Ponge</h1>
//           </div>
//           <div className="flex items-center">
//             <Link href="auth/sign-in">
//               <h1 className="bg-4A40BF text-white font-bold text-xl mx-4 px-3 py-2 rounded">Login</h1>
//             </Link>
//             <Link href="auth/sign-up">
//               <h1 className="bg-transparent border border-white text-white font-bold text-xl px-3 py-2 rounded">Sign Up</h1>
//             </Link>
//           </div>
//         </nav>

//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
//           <h1 className="text-4xl font-bold mb-4">
//             Revive the Classic, Conquer the Pong World!
//           </h1>
//           <p className="text-lg mb-4">
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
//           </p>
//           <Link href="auth/sign-in">
//               <h1 className="bg-4A40BF text-white font-bold text-xl px-4 py-2 rounded">login</h1>
//             </Link>
//         </div>
//       </div>
//     </main>
//   );
// }

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between h-screen p-0">
      <nav
        className="flex justify-between items-center w-full px-4 py-2 bg-transparent"
        style={{
          backgroundImage: `url('/background.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="flex items-center">
          <h1 className="text-white font-bold text-xl">Ponge</h1>
        </div>
        <div className="flex items-center">
          <Link href="/sign-in">
            <h1 className="bg-logincColor text-white font-bold text-xl mx-4 px-3 py-2 rounded">Login</h1>
          </Link>
          <Link href="/sign-up">
            <h1 className="bg-transparent border border-white text-white font-bold text-xl px-3 py-2 rounded">Sign Up</h1>
          </Link>
        </div>
      </nav>

      <div className="flex flex-col items-center justify-center h-screen w-screen relative p-0">
        {/* Background image here */}
        <Image
          src="/background.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
          <h1 className="text-mainText text-4xl font-bold mb-4">
            Revive the Classic,<br></br> Conquer the Pong World!
          </h1>
          <p className="text-mainp text-lg mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.          </p>
          <Link href="auth/sign-in">
            <h1 className="bg-logincColor text-white font-bold text-xl px-4 py-2 rounded">Login</h1>
          </Link>
        </div>
      </div>
    </main>
  );
}