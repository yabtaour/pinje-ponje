"use client"
import React from 'react';
import { ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import InputCode from '@/app/components/inputCode';
import axios from '@/app/utils/axios';
import { Toast } from '@chakra-ui/react';
import { UpdateUser } from '@/app/globalRedux/features/authSlice';
import { fetchUserData } from '@/app/utils/auth';
import { useEffect, useState } from 'react';
import { resetPassword, updateUser, fetchQRCode } from "@/app/utils/update";
import { useAppSelector } from '@/app/globalRedux/store';
import { useDispatch } from 'react-redux';
import { getCookie } from "cookies-next";
import Image from 'next/image';


export function TwoFactorModal() {

    const user = useAppSelector((state) => state.authReducer.value.user);
    const [qrCodeData, setQrCodeData] = useState('');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [twofasuccess, settwofasuccess] = useState(false);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    const dispatch = useDispatch();
    const token = getCookie("token");


    const handleTwoFactorAuth = async () => {
        try {
            let accessToken: string | null = localStorage.getItem('access_token');
            const newStatus = true;
            console.log('newStatus:', newStatus);
            const response = await axios.patch("/users", { twoFactor: newStatus }, {
                headers: {
                    Authorization: token,
                },
            });
            setTwoFactorAuth(newStatus);
            if (response) {
                const data = await fetchQRCode(accessToken);
                setQrCodeData(data);
            }

        } catch (error) {
            console.error("Failed to update user 2FA (caught actual error :p):", error);
            throw error;
        }

    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                let accessToken: string | null = localStorage.getItem('access_token');
                if (accessToken) {
                    const userData = await fetchUserData(accessToken);
                    const userChanged = JSON.stringify(user) !== JSON.stringify(userData);
                    if (userChanged) {
                        dispatch(UpdateUser(userData));
                    }
                    // setTwoFactorAuth(userData?.twoFactor);
                    try {
                        await handleTwoFactorAuth();
                        setTwoFactorAuth(!twoFactorAuth);

                    } catch (error) {
                        console.error('Failed to update Two Factor Authentication:', error);
                    }
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
            }

        };

        fetchData();
    }, [user, dispatch]);

    const handleSubmit = async (values: any) => {
        try {
            const res = await axios.post('/auth/2fa', { twofactorcode: values }, {
                headers: {
                    Authorization: token,
                },
            });
            if (res.status === 201) {
                console.log('2fa success');
                settwofasuccess(true);
            }
        } catch (error) {
            console.error("2fa error", error);
            settwofasuccess(false);
        }
        finally {
            setSubmissionAttempted(true);
        }
    }

    return (
        <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
                <div className='flex h-screen w-screen shadow'>
                    <div className='h-50vh w-60vw absolute inset-0 flex items-center justify-center '>
                        <div className='p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg'>
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
                                        <InputCode onSubmit={handleSubmit} />
                                        {submissionAttempted && !twofasuccess ? (
                                            <p className='text-red-500 text-xs'>Your code is wrong, enter a new one</p>
                                        ) : null}
                                        {submissionAttempted && twofasuccess ? (
                                            <p className="text-green-500 text-xs">Your code is correct!</p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </>
    );
}

export function TwoFactorModalDeactivate({ }) {

    const user = useAppSelector((state) => state.authReducer.value.user);
    const [qrCodeData, setQrCodeData] = useState('');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const [changeSuccess, setChangeSuccess] = useState(false);
    const dispatch = useDispatch();
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    const token = getCookie("token");


    const handleTwoFactorAuth = async () => {
        try {
            const newStatus = false;
            console.log('newStatus:', newStatus);
            const response = await axios.patch("/users", { twoFactor: newStatus }, {
                headers: {
                    Authorization: token,
                },
            });
            setTwoFactorAuth(newStatus);
        } catch (error) {
            console.error("Failed to update user 2FA (caught actual error :p):", error);
            throw error;
        }

    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let accessToken: string | null = localStorage.getItem('access_token');
                if (accessToken) {
                    const userData = await fetchUserData(accessToken);
                    const userChanged = JSON.stringify(user) !== JSON.stringify(userData);
                    if (userChanged) {
                        dispatch(UpdateUser(userData));
                    }
                    setTwoFactorAuth(userData?.twoFactor);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchData();
    }, [dispatch]);

    return (
        <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
                <div className='flex h-screen w-screen shadow'>
                    <div className='h-50vh w-60vw absolute inset-0 flex items-center justify-center '>
                        <div className='p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg'>
                            <div className='flexs flex-col items-center rounded-lg bg-[#1B1A2D]'>

                                <h1 className='text-lg lg:text-xl font-bold mb-7 text-[#77DFF8] text-center'>Deactivate Two Factor Authentication</h1>
                                <div className="flex items-center p-4 bg-yellow-400 rounded-md text-gray-700 shadow-md">
                                    <svg className="mr-2 h-5 w-5 text-yellow-600"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M13 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 20h8" />
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
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
            </ModalFooter>
        </>
    );

}