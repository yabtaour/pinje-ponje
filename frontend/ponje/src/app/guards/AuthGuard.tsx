'use client';
'use strict';
import { login } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData, getToken, setSession, verifyToken } from '@/app/utils/auth';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setRooms } from '../globalRedux/features/chatSlice';
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
        let accessToken = getToken();

        if (!accessToken)
            router.push('/sign-in');

        if (!tokenFromSlice)
            dispatch(login({ token: accessToken }));

        if (accessToken && !isAithenticated) {
            const socketManager = SocketManager.getInstance(`${process.env.NEXT_PUBLIC_API_URL}`, accessToken);
            fetchUserData(accessToken).then((data) => {
                dispatch(login({ user: data, token: accessToken }));
                setSession(accessToken);

                if (data?.data?.twoFactor && !localStorage.getItem('2fa'))
                    router.push('/verification');
                // if (!data?.profile?.avatar)
                //     router.push('/onboarding');
            })



            socketManager.waitForConnection(async () => {
                console.log("socketManager: ", socketManager);
                try {
                    const rooms = await socketManager.getConversations();
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
    }, [isAithenticated, router, dispatch, tokenFromSlice]);

    return <>{children}</>;
};


export default AuthGuard;





