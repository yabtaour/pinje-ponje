import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

type EventType = "notifications" | "newMessage";

const SOCKET_SERVER_URL = "http://localhost:3000";

const useSocket = () => {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [gameSocket, setGameSocket] = useState<Socket | null>(null);
  const [statusSocket, setStatusSocket] = useState<Socket | null>(null);
  const [notificationSocket, setNotificationSocket] = useState<Socket | null>(
    null
  );

  useEffect(() => {
    const newChatSocket = io(`${SOCKET_SERVER_URL}/chat`, {
      autoConnect: false,
    });
    const newGameSocket = io(`${SOCKET_SERVER_URL}/game`, {
      autoConnect: false,
    });
    const newStatusSocket = io(`${SOCKET_SERVER_URL}/status`, {
      autoConnect: false,
    });
    const newNotificationSocket = io(`${SOCKET_SERVER_URL}/notification`, {
      autoConnect: false,
    });

    setChatSocket(newChatSocket);
    setGameSocket(newGameSocket);
    setStatusSocket(newStatusSocket);
    setNotificationSocket(newNotificationSocket);

    return () => {
      newChatSocket.close();
      newGameSocket.close();
      newStatusSocket.close();
      newNotificationSocket.close();
    };
  }, []);

  //chatSocket
  const sendMessage = (message: string) => {
    if (chatSocket) {
      chatSocket.emit("sendMessage", message);
    }
  };

  const listen = (event: EventType, callback: Function) => {
    if (chatSocket) {
      chatSocket.on(event, (data: any) => {
        callback(data);
      });
    }
  };

  //statusSocket
  //   const setStatus = (status: string) => {
  //     if (statusSocket) {
  //       statusSocket.emit("setStatus", status);
  //     }
  //   };

  //gameSocket
  //notificationSocket

  return {
    chatSocket,
    gameSocket,
    statusSocket,
    notificationSocket,
    sendMessage,
    listen,
    // setStatus,
  };
};

export default useSocket;
