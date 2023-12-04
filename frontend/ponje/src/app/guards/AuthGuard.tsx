'use client';
'use strict';
import { login } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData, setSession, verifyToken } from '@/app/utils/auth';
import { getCookie } from 'cookies-next';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRooms } from '../globalRedux/features/chatSlice';
import axios from '../utils/axios';
import SocketManager from '../utils/socketManager';



interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {


    const router = useRouter();
    const isAithenticated = useAppSelector((state) => state.authReducer.value.isAuthenticated);
    const tokenFromSlice = useAppSelector((state) => state.authReducer.value.token);
    const dispatch = useDispatch();



    useEffect(() => {


        console.log("testing the intra login ");


        let tokenFromCookie = getCookie('token')
        if (tokenFromCookie)
            localStorage.setItem('access_token', tokenFromCookie);

        if (!tokenFromSlice)
            dispatch(login({ token: tokenFromCookie }));

        const accessToken: string | null = localStorage.getItem('access_token');
        if (accessToken && !isAithenticated) {
            const socketManager = SocketManager.getInstance('http://localhost:3000', accessToken);
            fetchUserData(accessToken).then((data) => {
                dispatch(login({ user: data, token: accessToken }));
                setSession(accessToken);

                console.log(axios.defaults.headers.common.Authorization);
                console.log("socketManager: ", socketManager);
            })
            socketManager.waitForConnection(async () => {
                console.log("socketManager: ", socketManager);
                try {
                    const rooms = await socketManager.getConversations();
                    console.log("rooms: ", rooms);
                    dispatch(setRooms(rooms));
                } catch (error) {
                    console.error("Error fetching rooms:", error);
                }
            });
        }

        if (!isAithenticated && !accessToken && !verifyToken(accessToken)) {
            redirect('/sign-in');
            // router.push('/sign-in');
        }
    }, [isAithenticated, router]);

    return <>{children}</>;
};


export default AuthGuard;





