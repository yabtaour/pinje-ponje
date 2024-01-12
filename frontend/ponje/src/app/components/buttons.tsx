'use client';

import { Handle42Auth, HandleGoogleAuth } from "../utils/auth";


let popup: Window | null = null;

export default function Auth42Button({ type = "login" }) {
    const message = type === "login" ? "Log in with Intra" : "Sign up with Intra";
    return (
        <button onClick={Handle42Auth} type="button" className="text-white bg-slate-800 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-[92px] py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55  mb-4">
            <svg width="20" height="20" viewBox="0 0 948 666" fill="none" xmlns="http://www.w3.org/2000/svg" className="">
                <path d="M344 666H522V346H182L522 0H344L0 346V494H344V666Z" fill="white" />
                <path d="M948 358V526H780H602V356L780 178V0L602 178V0H780H948V178L780 346V526L948 358Z" fill="white" />
            </svg>
            <span className="ml-2">{message}</span>
        </button>
    )
};

export function AuthGoogleButton({ type = "login" }) {
    const message = type === "login" ? "Log in with Google" : "Sign up with Google";
    return (
        <button onClick={HandleGoogleAuth} type="button" className="text-slate-900 bg-slate-100 hover:bg-slate-700 focus:ring-4 focus:outline-none focus:ring-[#3b5998]/50 font-medium rounded-lg text-sm px-[83px] py-2.5 text-center inline-flex items-center dark:focus:ring-[#3b5998]/55  mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
            <span className="ml-1">{message}</span>
        </button>
    )
}




export function AcceptFriendRequest() {
}

export function DeclineFriendRequest() {
}

export function AcceptGameInvitation() {
}

export function DeclineGameInvitation() {
}