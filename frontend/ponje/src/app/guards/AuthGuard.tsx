'use client';
import { login } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData, verifyToken } from '@/app/utils/auth';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';



interface AuthGuardProps {
    children: React.ReactNode;
    // cookie: string | undefined;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {


    const router = useRouter();
    const isAithenticated = useAppSelector((state) => state.authReducer.value.isAuthenticated);
    const dipatch = useDispatch();



    useEffect(() => {
        let tokenFromCookie = getCookie('token')
        if (tokenFromCookie)
            localStorage.setItem('access_token', tokenFromCookie);

        const accessToken: string | null = localStorage.getItem('access_token');
        if (accessToken && !isAithenticated) {
            fetchUserData(accessToken).then((data) => {

                dipatch(login({ user: data, token: accessToken }));
            })
        }

        if (!isAithenticated && !accessToken && !verifyToken(accessToken))
            router.push('/sign-in');
    }, [isAithenticated, router]);

    return <>{children}</>;
};


export default AuthGuard;





