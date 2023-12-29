'use strict';
'use client'


import SocketManager from "@/app/utils/socketManager";
import { useToast } from "@chakra-ui/react";
import { ScrollShadow } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { LayoutProps, motion, useAnimation } from "framer-motion";
import React, { useEffect, useState } from "react";
import Conversation from "./components/conversation";

const socketManager = SocketManager.getInstance(`${process.env.NEXT_PUBLIC_API_URL}`, getCookie('token'));


const Layout: React.FC<LayoutProps> = ({ children }: any) => {

    const [collapsed, setCollapsed] = useState(false);
    const controls = useAnimation();
    const toast = useToast();

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
        controls.start({ width: collapsed ? '5rem' : '17rem' });
    }, [collapsed, controls]);

    useEffect(() => {
        const handleCatch = async () => {
            try {
                await socketManager.catchErrors();
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error?.message,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                });
            }
        }
        handleCatch();

    }, [toast]);

    return (
        <div className=" flex w-full  bg-gray-200">
            <aside className="bg-[#1B1A2D] p-2 overflow-auto">

                <motion.div
                    style={{ width: '15rem' }}
                    animate={controls}
                    transition={{ duration: 0.1 }}
                >
                    <ScrollShadow hideScrollBar className="w-[17rem] h-[91vh]">
                        <Conversation collapsed={collapsed} />
                    </ScrollShadow>
                </motion.div >
            </aside>
            <main className="flex-grow overflow-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
