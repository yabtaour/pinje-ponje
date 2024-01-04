'use strict';
'use client';
import SocketManager from '@/app/utils/socketManager';
import { useToast } from '@chakra-ui/react';
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import NavBar from '../components/navbar';
import SideBar, { Collapse } from '../components/sidebar';
import { setNewNotification } from '../globalRedux/features/authSlice';
import { AuthProvider } from "../globalRedux/provider";
import { useAppSelector } from "../globalRedux/store";
import AuthGuard from "../guards/AuthGuard";
import { getToken } from '../utils/auth';


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(true);
    const token = useAppSelector((state) => state.authReducer.value.token);
    // const [showToast, setShowToast] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const dispatch = useDispatch()
    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    // useEffect(() => {
    //     const timeoutId = setTimeout(() => {
    //         setShowToast(false);
    //     }, 3000);

    //     return () => {
    //         clearTimeout(timeoutId);
    //     };
    // }, [showToast]);

    useEffect(() => {

        const token = getToken();
        if (!token) {
            toast({
                title: 'Error',
                description: "user not logged in",
                status: 'error',
                duration: 3000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
                colorScheme: "red",
            });
            router.push('/sign-in');
            return;
        }


        const fetchNotifications = async () => {
            const SocketManagerNotifs = SocketManager.getInstance(`${process.env.NEXT_PUBLIC_API_URL}`, token);
            if (SocketManagerNotifs) {
                SocketManagerNotifs.waitForConnection(() => {
                    try {
                        SocketManagerNotifs.getNotifications(() => {
                            dispatch(setNewNotification(true));
                        });

                    } catch (error) {
                        console.error("Error fetching notifications:", error);
                    }
                })
            }

        };
        fetchNotifications();
    }, []);
    useEffect(() => {




    }, [token]);
    return (
        <AuthProvider>
            <AuthGuard>
                <NextUIProvider>
                    <div className="flex overflow-y-auto flex-col h-full">
                        <div className="w-full border-b border-blue-500">
                            <NavBar onToggleSidebar={toggleSidebar} />
                        </div>
                        <div className=" flex flex-1  top-0">
                            <aside
                                className={`${collapsed ? 'w-16' : 'w-48'
                                    } border-r  border-blue-500 bg-[#151424] transition-all duration-300 overflow-y-auto  top-0 ease-in-out ${collapsed ? 'hidden md:block' : ''
                                    }`}
                            >
                                <button
                                    onClick={toggleSidebar}
                                    className={`absolute z-10 p-1  ${collapsed ? 'left-[50px]' : 'left-[180px]'} transition-all duration-300 overflow-y-auto text-gray-900 rounded-full bg-gray-100 dark:bg-gray-700 group focus:outline-none`}
                                >
                                    <Collapse collapsed={collapsed} setCollapsed={toggleSidebar} />
                                </button>
                                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                            </aside>
                            <div className="flex-1 ml-0 transition-all duration-300 ease-in-out relative z-0 overflow-x-hidden">
                                {/* {showToast &&
                                    <div className="toast toast-end">
                                        <div className="alert alert-info">
                                            <span>New notification arrived.</span>
                                        </div>
                                    </div>} */}
                                {children}
                            </div>
                        </div>
                    </div>
                </NextUIProvider>
            </AuthGuard>
        </AuthProvider>
    );



}      