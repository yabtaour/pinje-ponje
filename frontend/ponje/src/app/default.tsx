"use client";
import Image from "next/image"
import { useRouter } from "next/navigation";
export default function Default() {
  const router = useRouter();

  const handleHomeClick = () => {
    router.push('/profile');
  }
  return (
    <div className="text-white w-screen h-screen bg-[#2b2948] flex flex-column justify-center">
      <Image src="/404_art.svg" alt="not found" width={2000} height={2000} className="w-[80%] h-[80%]"/>
      <button className="btn btn-sm btn-primary mt-5" onClick={() => handleHomeClick()}>Go back to profile</button>
    </div>
  )
}
