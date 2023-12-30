'use client';
import { setVerified } from '@/app/globalRedux/features/authSlice';
import axios from '@/app/utils/axios';
import { useToast } from '@chakra-ui/react';
import { getCookie } from "cookies-next";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';


export default function VerificationPage() {
    const router = useRouter();
    const token = getCookie("token");
    const [twofasuccess, settwofasuccess] = useState(false);
    const [submissionAttempted, setSubmissionAttempted] = useState(false);
    const dispatch = useDispatch();
    const toast = useToast();
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
                dispatch(setVerified(true));
                localStorage.setItem('2fa', 'true');
                router.push('/profile');
                settwofasuccess(true);
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: "2FA error",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
                colorScheme: "red",
            });
            console.error("2fa error", error);
            settwofasuccess(false);
        }
        finally {
            setSubmissionAttempted(true);
        }
    }


    const [code, setCode] = useState<string>("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        const index = parseInt(name);

        if (value.length > 1) {
            return;
        }

        const newCode = code.split("");
        newCode[index] = value;
        setCode(newCode.join(""));

        if (/^\d$/.test(value)) {
            const nextIndex = index + 1;
            if (nextIndex < inputRefs.current.length) {
                inputRefs.current[nextIndex]?.focus();
            } else if (nextIndex === inputRefs.current.length) {
                newCode.join("");
            }
        } else if (value === "" && index > 0) {
            const prevIndex = index - 1;
            inputRefs.current[prevIndex]?.focus();
        } else {
            inputRefs.current[index]?.focus();
        }
    };

    const handleArrowKey = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (event.key === "ArrowLeft" && index > 0) {
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        } else if (event.key === "ArrowRight" && index < 5) {
            event.preventDefault();
            inputRefs.current[index + 1]?.focus();
        }
        else if (event.key === "Backspace" && index > 0) {
            const newCode = code.split("");
            newCode[index - 1] = "";
            setCode(newCode.join(""));
            event.preventDefault();
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        event.preventDefault();
        const pastedText = event.clipboardData.getData("text/plain");
        const newCode = pastedText.replace(/[^\d]/g, "").slice(0, 6);
        setCode(newCode.padEnd(6, " "));
        inputRefs.current[0]?.focus();
    };

    const handleSubmit = (event: React.BaseSyntheticEvent) => {
        event.preventDefault();
        setSubmissionAttempted(true);

        const trimmedCode = code.replace(/\s/g, "");
        if (trimmedCode.length !== 6 || !/^\d+$/.test(trimmedCode)) {
            console.log("error");

        }
        else {
            verifyCode(trimmedCode);
        }
    };

    return (
        <div className='flex flex-col min-h-screen relative overflow-hidden'>
            <Image
                src="/edited_background.png"
                alt="Background Image"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="bg-cover bg-fixed max-w-screen bg-center bg-no-repeat mb-8 md:h-[350px]"
            />

            <div className='h-3vh w-4vw md:h-50vh md:w-60vw absolute inset-0 flex items-center justify-center '>
                <div className='p-10 flex flex-col items-center bg-[#1B1A2D] shadow-lg'>
                    <svg width="128" height="128" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" className=' w-20 h-20 md:w-32 md:h-32'>
                        <path fill="none" stroke="#06b6d4" strokeLinecap="round" strokeLinejoin="round" d="M24 4.5a.75.75 0 0 1 .26 0l16.08 4.82a.93.93 0 0 1 .66.88V26a15 15 0 0 1-4.87 11.2c-3 2.84-7.17 4.83-11.87 6.22a.86.86 0 0 1-.52 0c-4.7-1.39-8.85-3.38-11.87-6.22A15 15 0 0 1 7 26V10.2a.93.93 0 0 1 .66-.88l16.08-4.78a.75.75 0 0 1 .26 0Zm-8.91 15.2a2.87 2.87 0 1 1-2.87 2.87a2.87 2.87 0 0 1 2.87-2.87Zm7.3 0a2.87 2.87 0 1 1-2.87 2.87a2.88 2.88 0 0 1 2.87-2.87Zm7.29 0a2.87 2.87 0 1 1-2.87 2.87a2.87 2.87 0 0 1 2.87-2.87Zm5.44-4.6v15" />
                    </svg>
                    <div className='flexs flex-col items-center rounded-lg bg-[#1B1A2D]'>

                        <h1 className='text-xl md:text-2xl font-bold mb-7 text-[#4E40F4] text-center'>Authenticate Your Account</h1>

                        <p className='text-white pb-10  text-center text-sm md:text-lg'>Protecting your Account is out top priority . <br />
                            Please confirm your account by entering the 6-digit code
                        </p>

                        <div className='flex justify-center pb-5 items-center'>
                            <div className='flex justify-center flex-col items-center'>
                                <div>
                                    <div className='flex justify-center flex-col items-center'>
                                        <div className="flex flex-row items-center">
                                            {Array.from({ length: 6 }, (_, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    name={index.toString()}
                                                    maxLength={1}
                                                    value={code[index] || ""}
                                                    onChange={handleInputChange}
                                                    onPaste={handlePaste}
                                                    onKeyDown={(event) => handleArrowKey(event, index)}
                                                    ref={(el) => (inputRefs.current[index] = el)}
                                                    style={{
                                                        marginRight: "0.5rem",
                                                        width: "3.5rem",
                                                        height: "5.5rem",
                                                        textAlign: "center",
                                                        background: "#1B1A2D",
                                                        border: "1px solid #3B3A4D",
                                                        borderRadius: "8px",
                                                        color: "#FFFFFF",
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            className="mt-10 w bg-indigo-600 w-60 md:w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm    "
                                            type="button"
                                            disabled={code.trim().length === 0 || code.trim().length < 6}
                                            onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleSubmit(event)}            >
                                            Submit
                                        </button>
                                        {submissionAttempted && code.trim().length === 0 && (
                                            <p className="text-red-500 text-xs mt-2">Please enter a 6-digit code before submitting.</p>
                                        )}
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
            </div>
        </div>
    );
}

