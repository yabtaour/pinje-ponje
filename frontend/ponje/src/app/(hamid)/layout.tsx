'use client';
import { Inter } from "next/font/google"
import NavBar from '../components/navbar';
import SideBar from '../components/sidebar';
import { useState } from "react";







export default function Layout({
    children,
}: {
    children: React.ReactNode;
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
        <div>
            {/* Navbar */}
            <div style={{ position: 'fixed', top: 0, width: '100%', zIndex: 50, borderBottom: '1px solid #3574FF', }}>
                <NavBar />
            </div>

            {/* Sidebar */}
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






            {/* Main content */}
            <div style={mainStyle}>
                {children}
            </div>
        </div>
    );
}
