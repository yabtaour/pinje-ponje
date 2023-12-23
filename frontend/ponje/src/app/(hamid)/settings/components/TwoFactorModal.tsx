"use client"
import React from 'react';
import InputCode from '@/app/components/inputCode';
import axios from '@/app/utils/axios';
import { Toast } from '@chakra-ui/react';
import { useState } from 'react';
import { useAppSelector } from '@/app/globalRedux/store';
import { useDispatch } from 'react-redux';
import { getCookie } from "cookies-next";
import Image from 'next/image';


interface QrCodeProps {
    qrCodeData?: string;
    twoFactorAuth: boolean | undefined;
    toggleOpen: (index: number) => void;
    setTwoFactorAuth: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TwoFactorModal({
    qrCodeData,
    toggleOpen,
    twoFactorAuth,
    setTwoFactorAuth,
}: QrCodeProps) {

    const [isCodeValid, setIsCodeValid] = useState(true);
    const [twofasuccess, settwofasuccess] = useState(false);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    const token = getCookie("token");


    const verifyCode = async (values: any) => {
        try {
            console.log('values:', values);
            const res = await axios.post('/auth/2fa', { twofactorcode: values }, {
                headers: {
                    Authorization: token,
                },
            });
            if (res.status === 201) {
                console.log('2fa success');
                setTwoFactorAuth(true);
                settwofasuccess(true);
            }
        } catch (error) {
            console.error("2fa error", error);
            settwofasuccess(false);
            setIsCodeValid(false);
        }
        finally {
            setSubmissionAttempted(true);
            console.log("2fa finally", twofasuccess , isCodeValid);
        }
    }

    return (
        <div
            className="absolute left-0 right-0  top-0  z-20  flex h-[calc(100%-1rem)] 
                 w-full items-center justify-center bg-gray-900  bg-opacity-70 p-4 transition-opacity md:inset-0 md:h-full"
        >
            <div className="flex h-screen w-screen shadow">
                <div className="h-50vh w-60vw absolute inset-0 flex items-center justify-center  ">
                    <div className="p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg">
                        <div className='flex flex-col items-center rounded-lg bg-[#1B1A2D]'>

                            <button
                                type="button"
                                onClick={() => toggleOpen(0)}
                                className="ml-auto inline-flex items-center justify-end rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 "
                                data-modal-hide="defaultModal"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                    {!twoFactorAuth && (

                        <div className='flexs flex-col items-center rounded-lg bg-[#1B1A2D]'>

                            <h1 className='text-lg lg:text-xl font-bold mb-7 text-[#77DFF8] text-center'>Activate Two Factor Authentication</h1>
                            <p className='text-[#706bc6] pb-10 text-sm text-center font-semibold'>Protecting your Account is top priority . <br />
                                Scan the QR code below with the Google Authenticator App and enter the code.
                            </p>
                            <div className='flex flex-col justify-center items-center'>
                                {qrCodeData ? (
                                    <Image src={qrCodeData} alt="QR Code" width={200} height={200} className=' ' />
                                ) : (
                                    <div className='flex justify-center items-center flex-col'>
                                        <span className="loading loading-bars loading-lg text-primary"></span>
                                        <p className='text-primary'>fetching QR code</p>
                                    </div>
                                )
                                }
                                <div className='flex justify-center flex-col items-center pb-5 mt-4'>
                                    <InputCode onSubmit={verifyCode} isCodeValid={isCodeValid} />
                                    {submissionAttempted && !twofasuccess ? (
                                        <p className='text-red-500 text-xs'>Your code is wrong, enter a new one</p>
                                    ) : null}
                                    {submissionAttempted && twofasuccess ? (
                                        <p className="text-green-500 text-xs">Your code is correct!</p>
                                    ) : null}
                                </div>
                            </div>
                        </div>

                    )}
                    {twoFactorAuth && (
                        <div className="flex flex-col items-center space-y-6  p-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="95" height="72" viewBox="0 0 995 1172" fill="none">
                                <path fill-rule="evenodd" clipRule="evenodd" d="M67.5001 709C64.5001 358.8 63.1 183.7 63.1 183.7C331.1 37.2 655.2 37.2 923.2 183.7L931.8 707.6C845.7 886.3 700.9 1016.7 497.5 1098.7C241.3 988 98.0001 858.1 67.5001 709ZM5.80005 726.5C2.50005 326.2 0.800049 126 0.800049 126C307.2 -41.5 677.8 -41.5 984.2 126L994.1 724.9C895.6 929.3 730.1 1078.3 497.5 1172C204.7 1045.5 40.8 897 5.80005 726.5Z" fill="#008837" />
                                <path fill-rule="evenodd" clipRule="evenodd" d="M220.1 591.3L298.6 506.1L405.9 616.4L724.6 304L801.3 379.9L408.3 776L220.1 591.3ZM113.6 695.8C111 383.1 109.6 226.8 109.6 226.8C348.9 96.0002 638.2 96.0002 877.5 226.8L885.3 694.5C808.4 854 679.1 970.5 497.5 1043.7C268.8 944.9 140.8 828.9 113.6 695.8Z" fill="#008837" />
                            </svg>
                            <p className="text-base leading-relaxed text-[#77DFF8] ">
                                2FA Activated!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </div>

    );
}

export function TwoFactorModalDeactivate({
    toggleOpen,
    twoFactorAuth,
    setTwoFactorAuth,
}: QrCodeProps) {

    const [changeSuccess, setChangeSuccess] = useState(false);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    const token = getCookie("token");


    const handleTwoFactorAuth = async () => {
        try {
            const newStatus = false;
            const response = await axios.patch("/users", { twoFactor: newStatus }, {
                headers: {
                    Authorization: token,
                },
            });
            if (response) {
                setTwoFactorAuth(newStatus);
                setSubmissionAttempted(true);
                setChangeSuccess(true);
            }
        } catch (error) {
            setChangeSuccess(false);
            setSubmissionAttempted(true);
            console.error("Failed to update user 2FA (caught actual error :p):", error);
            throw error;
        }

    };



    return (
        <div
            className="absolute left-0 right-0  top-0  z-20  flex h-[calc(100%-1rem)] 
                 w-full items-center justify-center bg-gray-900  bg-opacity-70 p-4 transition-opacity md:inset-0 md:h-full"
        >
            <div className="flex h-screen w-screen shadow">
                <div className="h-50vh w-60vw absolute inset-0 flex items-center justify-center  ">
                    <div className="p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg">
                        <div className='flex flex-col items-center rounded-lg bg-[#1B1A2D]'>

                            <button
                                type="button"
                                onClick={() => toggleOpen(1)}
                                className="ml-auto inline-flex items-center justify-end rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 "
                                data-modal-hide="defaultModal"
                            >
                                <svg
                                    className="h-5 w-5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        {twoFactorAuth && (
                            <div className='flex flex-col items-center rounded-lg bg-[#1B1A2D]'>
                                <h1 className='text-lg lg:text-xl font-bold mb-7 text-[#77DFF8] text-center'>Deactivate Two Factor Authentication</h1>
                                <div className="flex items-center p-4 bg-yellow-400 rounded-md text-gray-700 shadow-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <g clipPath="url(#clip0_1171_429)">
                                            <path d="M31.1074 26.1523L19.3037 2.54395C18.6738 1.28516 17.4082 0.50293 16 0.50293C14.5923 0.50293 13.3266 1.28516 12.6967 2.54395L0.892541 26.1523C0.315881 27.3057 0.376431 28.6484 1.05416 29.7451C1.73238 30.8418 2.9067 31.4971 4.19625 31.4971H27.8037C29.0937 31.4971 30.2685 30.8418 30.9463 29.7451C31.624 28.6484 31.6836 27.3047 31.1074 26.1523ZM28.3935 28.168C28.3183 28.291 28.1406 28.4971 27.8037 28.4971H4.19625C3.85982 28.4971 3.68209 28.291 3.60641 28.168C3.53024 28.0459 3.42575 27.7949 3.57614 27.4941L15.3799 3.88574C15.5527 3.54004 15.8711 3.50293 16 3.50293C16.1289 3.50293 16.4472 3.54004 16.6201 3.88574L28.4238 27.4941C28.5742 27.7949 28.4697 28.0459 28.3935 28.168Z" fill="#9B761F" />
                                            <path d="M16 8.95508C15.1714 8.95508 14.5 9.62696 14.5 10.4551V19.9912C14.5 20.8193 15.1714 21.4912 16 21.4912C16.8286 21.4912 17.5 20.8193 17.5 19.9912V10.4551C17.5 9.62695 16.8286 8.95508 16 8.95508ZM16 22.8662C15.1714 22.8662 14.5 23.5381 14.5 24.3662V25.4551C14.5 26.2832 15.1714 26.9551 16 26.9551C16.8286 26.9551 17.5 26.2832 17.5 25.4551V24.3662C17.5 23.5381 16.8286 22.8662 16 22.8662Z" fill="#9B761F" />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_1171_429">
                                                <rect width="32" height="32" fill="white" />
                                            </clipPath>
                                        </defs>
                                    </svg>
                                    <span>By clicking this button you will deactivate Two Factor Authentication for your account</span>
                                </div>
                                <button className="bg-[#77DFF8] hover:bg-[#77DFF8] text-white font-bold py-2 px-4 rounded mt-4" onClick={handleTwoFactorAuth}>Deactivate</button>
                                <div className='flex flex-col justify-center items-center'>
                                    <div className='flex justify-center flex-col items-center pb-5 mt-4'>
                                        {submissionAttempted && !changeSuccess ? (
                                            Toast({
                                                title: 'Error',
                                                status: 'error',
                                                duration: 9000,
                                                isClosable: true,
                                                position: "bottom-right",
                                                variant: "solid",
                                            })
                                        ) : (
                                            null
                                        )}
                                        {submissionAttempted && changeSuccess ? (
                                            Toast({
                                                title: 'TwoFa disabled Successfully :D',
                                                status: 'success',
                                                duration: 9000,
                                                isClosable: true,
                                                position: "bottom-right",
                                                variant: "solid",
                                            })
                                        ) : (
                                            null
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {!twoFactorAuth && (
                            <div className="flex flex-col items-center space-y-6  p-6">
                                <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24" fill="none">
                                    <path d="M9.66 21.7396C9.4 21.7396 9.13 21.7096 8.87 21.6196C8.12 21.3796 7.62 20.7996 7.17 20.2996C6.93 20.0296 6.7 19.7696 6.47 19.5996C6.24 19.4296 5.92 19.2896 5.58 19.1396C4.96 18.8696 4.27 18.5696 3.81 17.9396C3.36 17.3196 3.28 16.5696 3.22 15.8996C3.18 15.5296 3.15 15.1796 3.06 14.8996C2.97 14.6396 2.8 14.3496 2.62 14.0396C2.28 13.4596 1.88 12.7996 1.88 11.9996C1.88 11.1996 2.27 10.5396 2.62 9.95959C2.8 9.64959 2.98 9.35959 3.06 9.09959C3.15 8.81959 3.19 8.46959 3.22 8.09959C3.29 7.43959 3.36 6.67959 3.81 6.05959C4.26 5.42959 4.96 5.12959 5.58 4.85959C5.92 4.70959 6.24 4.56959 6.47 4.39959C6.7 4.22959 6.93 3.96959 7.17 3.69959C7.62 3.18959 8.12 2.61959 8.87 2.37959C9.59 2.14959 10.32 2.30959 10.97 2.44959C11.71 2.60959 12.28 2.60959 13.02 2.44959C13.67 2.30959 14.4 2.14959 15.12 2.37959C15.87 2.61959 16.37 3.19959 16.82 3.69959C17.06 3.96959 17.29 4.22959 17.52 4.39959C17.75 4.56959 18.07 4.70959 18.41 4.85959C19.03 5.12959 19.72 5.42959 20.18 6.05959C20.63 6.67959 20.71 7.42959 20.77 8.09959C20.81 8.46959 20.84 8.81959 20.93 9.09959C21.02 9.35959 21.19 9.64959 21.37 9.95959C21.71 10.5396 22.11 11.1996 22.11 11.9996C22.11 12.7996 21.72 13.4596 21.37 14.0396C21.19 14.3496 21.01 14.6396 20.93 14.8996C20.84 15.1796 20.8 15.5296 20.77 15.8996C20.7 16.5596 20.63 17.3196 20.18 17.9396C19.73 18.5696 19.03 18.8696 18.41 19.1396C18.07 19.2896 17.75 19.4296 17.52 19.5996C17.29 19.7696 17.06 20.0296 16.82 20.2996C16.37 20.8096 15.87 21.3796 15.12 21.6196C14.41 21.8496 13.67 21.6896 13.02 21.5496C12.28 21.3896 11.71 21.3896 10.97 21.5496C10.56 21.6396 10.12 21.7396 9.66 21.7396ZM9.66 3.76959C9.54 3.76959 9.43 3.77959 9.33 3.81959C8.97 3.93959 8.65 4.30959 8.3 4.70959C8.02 5.02959 7.72 5.36959 7.36 5.62959C6.99 5.89959 6.58 6.07959 6.18 6.24959C5.7 6.45959 5.24 6.65959 5.03 6.94959C4.82 7.23959 4.77 7.72959 4.72 8.24959C4.68 8.67959 4.63 9.12959 4.49 9.56959C4.35 9.98959 4.13001 10.3696 3.91001 10.7296C3.64001 11.1896 3.38001 11.6196 3.38001 12.0096C3.38001 12.3996 3.64001 12.8296 3.91001 13.2896C4.13001 13.6596 4.35 14.0296 4.49 14.4496C4.63 14.8896 4.68 15.3396 4.72 15.7696C4.77 16.2896 4.82 16.7796 5.03 17.0696C5.25 17.3696 5.7 17.5596 6.18 17.7696C6.58 17.9396 6.99 18.1196 7.36 18.3896C7.72 18.6496 8.02 18.9896 8.3 19.3096C8.65 19.7096 8.98 20.0796 9.33 20.1996C9.66 20.3096 10.14 20.1996 10.64 20.0896C11.07 19.9896 11.52 19.8996 11.99 19.8996C12.46 19.8996 12.91 19.9996 13.34 20.0896C13.85 20.1996 14.32 20.3096 14.65 20.1996C15.01 20.0796 15.33 19.7096 15.68 19.3096C15.96 18.9896 16.26 18.6496 16.62 18.3896C16.99 18.1196 17.4 17.9396 17.8 17.7696C18.28 17.5596 18.74 17.3596 18.95 17.0696C19.16 16.7796 19.21 16.2896 19.26 15.7696C19.3 15.3396 19.35 14.8896 19.49 14.4496C19.63 14.0296 19.85 13.6496 20.07 13.2896C20.34 12.8296 20.6 12.3996 20.6 12.0096C20.6 11.6196 20.34 11.1896 20.07 10.7296C19.85 10.3596 19.63 9.98959 19.49 9.56959C19.35 9.12959 19.3 8.67959 19.26 8.24959C19.21 7.72959 19.16 7.23959 18.95 6.94959C18.73 6.64959 18.28 6.45959 17.8 6.24959C17.4 6.07959 16.99 5.89959 16.62 5.62959C16.26 5.36959 15.96 5.02959 15.68 4.70959C15.33 4.30959 15 3.93959 14.65 3.81959C14.32 3.71959 13.84 3.81959 13.34 3.92959C12.91 4.02959 12.46 4.11959 11.99 4.11959C11.52 4.11959 11.07 4.01959 10.64 3.92959C10.28 3.84959 9.94 3.77959 9.66 3.77959V3.76959Z" fill="#4E40F4" />
                                    <path d="M11 14.7504C10.81 14.7504 10.62 14.6804 10.47 14.5304L8.47 12.5304C8.18 12.2404 8.18 11.7604 8.47 11.4704C8.76 11.1804 9.24 11.1804 9.53 11.4704L11 12.9404L14.47 9.47043C14.76 9.18043 15.24 9.18043 15.53 9.47043C15.82 9.76043 15.82 10.2404 15.53 10.5304L11.53 14.5304C11.38 14.6804 11.19 14.7504 11 14.7504Z" fill="#77DFF8" />
                                </svg>
                                <p className="text-base leading-relaxed text-[#77DFF8] ">
                                    2FA is deactivated ! Security measures revoked for your account.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

}