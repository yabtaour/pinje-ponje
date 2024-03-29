// type EventType = "notifications" | "newMessage";

// import { useContext } from "react";
// import { useSocketIO } from "../contexts/socketContext";

// const SOCKET_SERVER_URL = "http://localhost:3000";

// const useSocket = () => {
//   const [chatSocket, setChatSocket] = useState<Socket | null>(null);
//   const [gameSocket, setGameSocket] = useState<Socket | null>(null);
//   const [statusSocket, setStatusSocket] = useState<Socket | null>(null);
//   const [notificationSocket, setNotificationSocket] = useState<Socket | null>(
//     null
//   );

//   const chat = useAppSelector((state) => state.chatReducer);

//   const token = getCookie("token");

//   useEffect(() => {
//     const newChatSocket = io(`${SOCKET_SERVER_URL}/chat`, {
//       auth: { token: token },
//     });
//     const newGameSocket = io(`${SOCKET_SERVER_URL}/chat`, {
//       auth: { token: token },
//     });
//     const newStatusSocket = io(`${SOCKET_SERVER_URL}/chat`, {
//       auth: { token: token },
//     });
//     const newNotificationSocket = io(`${SOCKET_SERVER_URL}/chat`, {
//       auth: { token: token },
//     });

//     setChatSocket(newChatSocket);
//     setGameSocket(newGameSocket);
//     setStatusSocket(newStatusSocket);
//     setNotificationSocket(newNotificationSocket);

//     return () => {
//       newChatSocket.close();
//       newGameSocket.close();
//       newStatusSocket.close();
//       newNotificationSocket.close();
//     };
//   }, []);

//   //chatSocket
//   const sendMessage = (message: string) => {
//     if (chatSocket) {
//       chatSocket.emit("sendMessage", message, (res: any) => {});
//     }
//   };

//   const listen = (event: EventType, callback: Function) => {
//     if (chatSocket) {
//       chatSocket.on(event, (data: any) => {
//         callback(data);
//       });
//     }
//   };

//   //statusSocket
//   //   const setStatus = (status: string) => {
//   //     if (statusSocket) {
//   //       statusSocket.emit("setStatus", status);
//   //     }
//   //   };

//   //gameSocket
//   //notificationSocket

//   return {
//     chatSocket,
//     gameSocket,
//     statusSocket,
//     notificationSocket,
//     sendMessage,
//     listen,
//     // setStatus,
//   };
// };

// export default useSocket;

// export const useSocketIO = () => {
//   const socketIOContext = useContext(SocketIOContext);

//   if (!socketIOContext) {
//     throw new Error("useSocketIO must be used within a SocketIOProvider");
//   }

//   return socketIOContext as {
//     chatSocket: Socket | null;
//     notificationSocket: Socket | null;
//     gameSocket: Socket | null;
//     statusSocket: Socket | null;
//   };
// };
