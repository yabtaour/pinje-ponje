'use client';

import Auth42Button, { AuthGoogleButton } from "@/app/components/buttons";
import { useDisclosure, Button, Modal, ModalContent } from "@nextui-org/react";
import { NextUIProvider } from "@nextui-org/system";
import Link from "next/link";
import { useState } from "react";


export default function SignUp() {

    return (
        <div className="flex h-screen bg-gray-900">
            <div className="w-1/2">
                <img
                    src="/login_illust.png"
                    alt="Sample image"
                    className="w-[100%] h-full object-cover"
                    style={{ zIndex: 0 }}
                />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <h1 className="text-3xl text-cyan-300 mr-24 justify-between font-semibold mb-16">Hello hello!</h1>
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
                <div className="relative mt-10">
                    <div className="absolute top-[-1rem] text-slate-300 text-sm">Confirm password</div>
                    <input
                        className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-600 rounded mt-4"
                        type="password"
                        placeholder=". . . . . . . ."
                    />
                </div>
                <div className="text-center md:text-left">
                    <button
                        className="mt-4 bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                        type="submit"
                    >
                        Sign Up
                    </button>
                    <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-700">
                        <p className="mx-4 mb-0 text-center font-medium text-slate-500">OR</p>
                    </div>
                </div>
                <Auth42Button />
                <AuthGoogleButton />
                <div className="mt-4 font-semibold text-sm text-slate-500 mr-[100px] text-center md:text-left">
                    Already have an account? <Link className="text-cyan-200 hover:underline hover:underline-offset-4" href="/sign-in">Login</Link>
                </div>
            </div>
        </div>
    )
}