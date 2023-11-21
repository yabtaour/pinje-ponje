'use client'
import { LayoutProps, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import Conversation from "./components/conversation";

const Layout: React.FC<LayoutProps> = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const controls = useAnimation();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            } else {
                setCollapsed(false);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    useEffect(() => {
        controls.start({ width: collapsed ? '5rem' : '15rem' });
    }, [collapsed, controls]);

    return (
        <div className=" flex bg-gray-200">
            <aside className="bg-[#1B1A2D] p-4 overflow-auto">
                <motion.div
                    style={{ width: '15rem' }} // Set initial width
                    animate={controls}
                    transition={{ duration: 0.3 }} // Adjust duration as needed
                >
                    <Conversation collapsed={collapsed} />
                    {/* Here you can list your conversations */}
                </motion.div>
            </aside>

            
            <main className="flex-grow overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;