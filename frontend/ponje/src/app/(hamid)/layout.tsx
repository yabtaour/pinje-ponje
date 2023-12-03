'use strict';
'use client';
import { NextUIProvider } from "@nextui-org/system";
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
    // const globalSocket = useSocketIO();
    const [collapsed, setCollapsed] = useState(true);
    const token = useAppSelector((state) => state.authReducer.value.token);



    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };



    useEffect(() => {




    }, [token]);

    // console.log("from hamid ; ", globalSocket.chatSocket);

    return (
        <AuthProvider>
            <AuthGuard>

                {/* <SocketIOProvider> */}
                {/* <OnboardingGuard> */}
                <NextUIProvider>
                    <div className="flex flex-col h-full bg-gray-100">
                        <div className="w-full border-b border-blue-500">
                            <NavBar />
                        </div>
                        <div className="flex flex-1 sticky top-0">
                            <aside
                                className={`${collapsed ? 'w-16' : 'w-64'
                                    } border-r border-blue-500 transition-all duration-300 ease-in-out `}

                            >
                                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                            </aside>
                            <div className="flex-1 ml-0 transition-all duration-300 ease-in-out relative z-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </NextUIProvider>
                {/* </OnboardingGuard> */}
                {/* </SocketIOProvider> */}
            </AuthGuard>
        </AuthProvider>
    );
}