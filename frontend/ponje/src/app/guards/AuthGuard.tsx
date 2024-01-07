'use client';
'use strict';
import Loader from '@/app/components/loader';
import { login, logout } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData, getToken, setSession } from '@/app/utils/auth';
import SocketManager from '@/app/utils/socketManager';
import axios from 'axios';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useEffect, useLayoutEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRooms } from '../globalRedux/features/chatSlice';




interface AuthGuardProps {
    children: React.ReactNode;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {


    const router = useRouter();
    const isAithenticated = useAppSelector((state) => state.authReducer.value.isAuthenticated);
    const tokenFromSlice = useAppSelector((state) => state.authReducer.value.token);
    const dispatch = useDispatch();
    const [loader, setLoader] = React.useState(true);
    useLayoutEffect(() => {
        setTimeout(() => {
            setLoader(false);
        }, 1);
    }, []);


    useEffect(() => {
        let accessToken = getToken();

        if (!accessToken)
            router.push('/sign-in');

        const tokenVerification = async (token?: string | null | undefined) => {
            await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-token`, {}, {
                headers: {
                    Authorization: `${token}`,
                },
            })
                .then((res) => {
                    console.log("verifiedToken", res);
                })
                .catch((err) => {
                    console.log("do nothing:", err);
                    router.push('/');
                    localStorage.removeItem('2fa');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('auth');
                    deleteCookie('token');
                    dispatch(logout());

                });
        };
        tokenVerification(accessToken);
        if (accessToken && !isAithenticated) {

            fetchUserData(accessToken).then((data) => {
                dispatch(login({ user: data, token: accessToken }));
                setSession(accessToken);
                console.log("data: ", data);
                if (data?.twoFactor && !localStorage.getItem('2fa'))
                    router.push('/verification');
                if (!data?.profile?.avatar) {
                    router.push('/onboarding');
                }
            })

            const socketManager = SocketManager.getInstance(`${process.env.NEXT_PUBLIC_API_URL}`, accessToken);
            socketManager.waitForConnection(async () => {
                console.log("socketManager: ", socketManager);
                try {
                    // socketManager.getNewMessages();
                    console.log("socketManager: ", socketManager);
                    const rooms = await socketManager.getConversations();
                    dispatch(setRooms(rooms));
                } catch (error) {
                    console.error("Error fetching rooms:", error);
                }
            });
        }


    }, [isAithenticated, router, dispatch, tokenFromSlice]);

    // return <>{children}</>;
    return <>{loader ? (<Loader />) : (children)}</>;
};


export default AuthGuard;





