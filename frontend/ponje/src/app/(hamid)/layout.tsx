'use client';
import { useState } from "react";

import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import { AuthProvider } from "../globalRedux/provider";
import AuthGuard from "../guards/AuthGuard";


export default function Layout({
    children,
    // cookie,
}: {
    children: React.ReactNode;
    // cookie: string | undefined;
}) {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => {
        if (collapsed) {
            setCollapsed(false);
        }
        else {
            setCollapsed(true);
        }
    };

    const sidebarStyle = {

        position: 'fixed',
        top: '4rem',
        width: collapsed ? '4rem' : '16rem',
        height: '100vh',
    };

    const mainStyle = {
        // marginLeft: collapsed ? '4rem' : '16rem',
        // marginTop: '4rem',
        // padding: '1rem',
    };

    return (
        <AuthProvider>
            <AuthGuard >
                <div>

                    <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderBottom: '1px solid #3574FF', }}>
                        <NavBar />
                    </div>

                    <aside style={{

                        left: 0,
                        borderRight: '2px solid #3574FF',
                        position: 'fixed',
                        top: '4rem',
                        width: collapsed ? '6rem' : '10rem',
                        height: '100vh',
                    }}>
                        <SideBar collapsed={collapsed} toggleSidebar={toggleSidebar} />
                    </aside>
                    <div style={mainStyle}>
                        {children}
                    </div>
                </div>
            </AuthGuard>
        </AuthProvider>
    );
}
