import { getCookie } from 'cookies-next';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Socket, io } from 'socket.io-client';

type SocketIOContextProps = {
    chatSocket: Socket | null;
    notificationSocket: Socket | null;
    gameSocket: Socket | null;
    statusSocket: Socket | null;
};

const SocketIOContext = createContext<SocketIOContextProps>({
    chatSocket: null,
    notificationSocket: null,
    gameSocket: null,
    statusSocket: null,
});

export const useSocketIO = () => useContext(SocketIOContext);

type SocketIOProviderProps = {
    children: ReactNode;
};

export const SocketIOProvider = ({ children }: SocketIOProviderProps) => {
    const [chatSocket, setChatSocket] = useState<Socket | null>(null);
    const [notificationSocket, setNotificationSocket] = useState<Socket | null>(null);
    const [gameSocket, setGameSocket] = useState<Socket | null>(null);
    const [statusSocket, setStatusSocket] = useState<Socket | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    //TODO ; needs to be refactored
    const token = getCookie('token');



    useEffect(() => {
        const initSockets = () => {
            const chatSocketInstance = io(`http://localhost:3000/chat`, {
                auth: {
                    token: token,
                },
            });
            const notificationSocketInstance = io(`http://localhost:3000/chat`, {
                auth: {
                    token: token,
                },
                autoConnect: false,
            });
            const gameSocketInstance = io(`http://localhost:3000/chat`, {
                auth: {
                    token: token,
                    autoConnect: false,
                },
            });
            const statusSocketInstance = io(`http://localhost:3000/chat`, {
                auth: {
                    token: token,
                    autoConnect: false,
                },
            });

            setChatSocket(chatSocketInstance);
            setNotificationSocket(notificationSocketInstance);
            setGameSocket(gameSocketInstance);
            setStatusSocket(statusSocketInstance);
        };

        if (!isInitialized) {
            initSockets();
            setIsInitialized(true);
        }

        return () => {
            chatSocket?.close();
            notificationSocket?.close();
            gameSocket?.close();
            statusSocket?.close();
        };
    }, [token, isInitialized]);

    const contextValue = {
        chatSocket,
        notificationSocket,
        gameSocket,
        statusSocket,
        setChatSocket,
        setNotificationSocket,
        setGameSocket,
        setStatusSocket,
    };

    return (
        <SocketIOContext.Provider value={contextValue}>
            {children}
        </SocketIOContext.Provider>
    );
};