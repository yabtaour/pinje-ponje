'use strict';
'use client';
import SocketManager from '@/app/utils/socketManager';
import { NextUIProvider } from "@nextui-org/system";
import { user } from "@nextui-org/theme";
import { useEffect, useState } from "react";
import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import { AuthProvider } from "../globalRedux/provider";
import { useAppSelector } from "../globalRedux/store";
import AuthGuard from "../guards/AuthGuard";


export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(true);
    const token = useAppSelector((state) => state.authReducer.value.token);
    const [showToast, setShowToast] = useState(false);


    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setShowToast(false);
        }, 3000); // Adjust the timeout duration as needed

        return () => {
            clearTimeout(timeoutId);
        };
    }, [showToast]);

    useEffect(() => {
        const SocketManagerNotifs = SocketManager.getInstance("http://localhost:3000", `${localStorage.getItem('access_token')}`);
        const fetchNotifications = async () => {
            if (SocketManagerNotifs) {
                SocketManagerNotifs.waitForConnection(async () => {
                    const data = await SocketManagerNotifs.getNotifications();
                    console.log("HEEEEEEEEYO data i got back from server", data);
                    setShowToast(true);
                })
            }

        };
        fetchNotifications();
    }, [user]);
    useEffect(() => {




    }, [token]);
    return (
        <AuthProvider>
            <AuthGuard>
                <NextUIProvider>
                    <div className="flex overflow-y-auto sticky top-0 flex-col h-full bg-gray-100">
                        <div className="w-full border-b border-blue-500">
                            <NavBar onToggleSidebar={toggleSidebar} />
                        </div>
                        <div className="flex flex-1 sticky top-0">
                            <aside
                                className={`${collapsed ? 'w-16' : 'w-64'
                                    } border-r border-blue-500 transition-all duration-300 overflow-y-auto sticky top-0 ease-in-out ${collapsed ? 'hidden md:block' : ''
                                    }`}
                            >
                                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                            </aside>
                            <div className="flex-1 ml-0 transition-all duration-300 ease-in-out relative z-0 overflow-x-hidden">
                                {showToast &&
                                    <div className="toast toast-end">
                                        <div className="alert alert-info">
                                            <span>New mail arrived.</span>
                                        </div>
                                    </div>}
                                {children}
                            </div>
                        </div>
                    </div>
                </NextUIProvider>
            </AuthGuard>
        </AuthProvider>
    );



}      