'use client';
import InputCode from '@/app/components/inputCode';
import axios from '@/app/utils/axios';
import { Toast } from '@chakra-ui/react';
import { getCookie } from "cookies-next";
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function VerificationPage() {
    const router = useRouter();
    const token = getCookie("token");
    const handleSubmit = async (values: any) => {
        try {
            const res = await axios.post('/auth/2fa', { twofactorcode: values }, {
                headers: {
                    authorization: token,
                },
            });
            console.log(res);
            if (res.status === 201) {
                router.push('/profile');

            }

        }
        catch (error) {
            Toast({
                title: 'Error',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
            });
        }
    }

    return (
        <div className='flex h-screen w-screen shadow'>
            <Image
                src="/edited_background.png"
                alt="Sample image"
                className="w-full h-full object-cover"
                width={1920}
                height={1080}
            />

            <div className='h-50vh w-60vw absolute inset-0 flex items-center justify-center '>
                <div className='p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg'>
                    <svg width="128" height="128" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                        <path fill="none" stroke="#06b6d4" strokeLinecap="round" strokeLinejoin="round" d="M24 4.5a.75.75 0 0 1 .26 0l16.08 4.82a.93.93 0 0 1 .66.88V26a15 15 0 0 1-4.87 11.2c-3 2.84-7.17 4.83-11.87 6.22a.86.86 0 0 1-.52 0c-4.7-1.39-8.85-3.38-11.87-6.22A15 15 0 0 1 7 26V10.2a.93.93 0 0 1 .66-.88l16.08-4.78a.75.75 0 0 1 .26 0Zm-8.91 15.2a2.87 2.87 0 1 1-2.87 2.87a2.87 2.87 0 0 1 2.87-2.87Zm7.3 0a2.87 2.87 0 1 1-2.87 2.87a2.88 2.88 0 0 1 2.87-2.87Zm7.29 0a2.87 2.87 0 1 1-2.87 2.87a2.87 2.87 0 0 1 2.87-2.87Zm5.44-4.6v15" />
                    </svg>
                    <div className='flexs flex-col items-center rounded-lg bg-[#1B1A2D]'>

                        <h1 className='text-2xl font-bold mb-7 text-white text-center'>Authenticate Your Account</h1>

                        <p className='text-white pb-10  text-center'>Protecting your Account is out top priority . <br />
                            Please comfirm your account by entering the 6-digit code
                        </p>

                        <div className='flex justify-center pb-5'>
                            <InputCode onSubmit={handleSubmit} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

