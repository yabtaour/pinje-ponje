'use client';
import Auth42Button, { AuthGoogleButton } from "@/app/components/buttons";
import { Modal, ModalContent } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/system";
import Link from "next/link";
import React from "react";
import { useState } from "react";


export default function SignIn() {
    const [isOpen, setIsOpen] = useState(true);

    return (

        <NextUIProvider>

            <Modal
                className="max-w-4xl max-h-5xl"
                isOpen={isOpen}
                backdrop="blur"
                onOpenChange={() => {
                    setIsOpen(!isOpen);
                    console.log("isOpen: ", isOpen);
                }}
                onClose={() => {
                    setIsOpen(!isOpen);
                    console.log("isOpen: ", isOpen);
                }}
                radius="lg"
                classNames={{
                    closeButton: 'hidden',
                    base: "w-screen",
                    backdrop: "bg-gray-900/50",
                }}
            >
                <ModalContent>
                    {() => (
                        <>
                            <div className="flex bg-gray-900">
                                <div className="w-1/2">
                                    <img
                                        src="/login_illust.png"
                                        alt="Sample image"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center items-center p-8">
                                    <h1 className="text-3xl text-cyan-300 mr-24 justify-between font-semibold mb-16">Welcome back!</h1>
                                    <div className="relative">
                                        <div className="absolute top-[-2rem] text-slate-200 text-sm">Email</div>
                                        <input
                                            className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-600 border-slate-700 mb-10 rounded pl-3"
                                            type="text"
                                            placeholder="Email Address"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute top-[-1rem] text-slate-300 text-sm">Password</div>
                                        <input
                                            className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-600 rounded mt-4"
                                            type="password"
                                            placeholder=". . . . . . . ."
                                        />
                                    </div>
                                    <div className="mt-4 flex justify-between font-semibold text-sm items-center">
                                        <label className="flex text-slate-500 hover:text-slate-600 cursor-pointer mr-20">
                                            <input className="mr-2 items-start" type="checkbox" />
                                            <span>Remember Me</span>
                                        </label>
                                        <a className="text-blue-600 hover:text-blue-700 hover:underline hover:underline-offset-4" href="#">
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <button className="mt-4 bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm" type="submit">Sign In</button>
                                        <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-700">
                                            <p className="mx-4 mb-0 text-center font-medium text-slate-500">OR</p>
                                        </div>
                                    </div>
                                    <Auth42Button />
                                    <AuthGoogleButton />

                                    <div className="mt-4 font-semibold text-sm text-slate-500 mr-28 text-center md:text-left">
                                        Don't have an account? <Link className="text-cyan-200 hover:underline hover:underline-offset-4" href="/sign-up">Register</Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </NextUIProvider>
    );
}