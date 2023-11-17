'use client';
import { NextUIProvider } from "@nextui-org/system";
import { useState } from "react";
import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import { AuthProvider } from "../globalRedux/provider";
import AuthGuard from "../guards/AuthGuard";
export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(true);

    const toggleSidebar = () => {
        setCollapsed(!collapsed);
    };

    return (
        <AuthProvider>
            <AuthGuard>
                <NextUIProvider>
                    <div className="flex flex-col h-screen bg-gray-100">
                        <div className="w-full border-b border-blue-500">
                            <NavBar />
                        </div>
                        <div className="flex flex-1">
                            <aside
                                className={`${collapsed ? 'w-16' : 'w-64'
                                    } border-r border-blue-500 transition-all duration-300 ease-in-out sticky top-0`}
                                style={{ height: '100vh' }}
                            >
                                <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                            </aside>
                            <div className="flex-1 ml-0 transition-all duration-300 ease-in-out relative z-0">
                                {children}
                            </div>
                        </div>
                    </div>
                </NextUIProvider>
            </AuthGuard>
        </AuthProvider>
    );
}