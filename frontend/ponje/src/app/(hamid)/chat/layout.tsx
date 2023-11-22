'use client'
import { ScrollShadow } from "@nextui-org/react";
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
                    style={{ width: '15rem' }}
                    animate={controls}
                    transition={{ duration: 0.1 }}
                >
                    <ScrollShadow hideScrollBar className=" h-[90vh]">

                        <Conversation collapsed={collapsed} />
                    </ScrollShadow>
                </motion.div>

            </aside>
            <main className="flex-grow overflow-auto">
                {children}
            </main>

        </div>

    );
};

export default Layout;
