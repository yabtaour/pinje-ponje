'use client'
import { useEffect } from 'react';
import SocketManager from '@/app/utils/socketManager';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
  
    useEffect(() => {
        console.log("we're here");
        const socketManager = SocketManager.getInstance();
        if (!socketManager.getGameSocket()?.connected)
            socketManager.connectGameSocket();
    }, []);

    return (
        [children]
    );
}
