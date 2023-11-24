'use client'
import { ScrollShadow } from "@nextui-org/react";
import { LayoutProps, motion, useAnimation } from "framer-motion";
import React, { createContext, useEffect, useState } from "react";
import Conversation from "./components/conversation";


type ChatContextType = {
    activeConversation: any;
    setActiveConversation: React.Dispatch<React.SetStateAction<any>>;
};


export const ChatContext = createContext<ChatContextType>({
    activeConversation: null,
    setActiveConversation: () => { },
});



const Layout: React.FC<LayoutProps> = ({ children }: any) => {
    const [collapsed, setCollapsed] = useState(false);
    const controls = useAnimation();
    const [activeConversation, setActiveConversation] = useState<any>(null);


    // useEffect(() => {
    //     console.log("from layout: ", activeConversation);
    // }, [activeConversation?.id]);

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

    return (

        <ChatContext.Provider value={{ activeConversation, setActiveConversation }}>
            <div className=" flex bg-gray-200">
                <aside className="bg-[#1B1A2D] p-2 overflow-auto">
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
        </ChatContext.Provider>
    );
};

export default Layout;
