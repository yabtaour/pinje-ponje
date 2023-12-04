import { Dispatch } from "@reduxjs/toolkit";
import { Socket, io } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager | null = null;
  private chatSocket: Socket | null = null;
  private gameSocket: Socket | null = null;
  private notificationSocket: Socket | null = null;
  private statusSocket: Socket | null = null;
  private dispatchFunction: Dispatch | undefined;

  private constructor(
    url: string = "",
    token: string = "",
    dispatch?: Dispatch
  ) {
    this.dispatchFunction = dispatch;
    if (!this.chatSocket) {
      this.chatSocket = io(`${url}/chat`, {
        auth: {
          token: token,
        },
      });
    }

    if (!this.gameSocket) {
      this.gameSocket = io(`${url}/game`, {
        auth: {
          token: token,
        },
      });
    }

    if (!this.notificationSocket) {
      this.notificationSocket = io(`${url}/notification`, {
        auth: {
          token: token,
        },
      });
    }

    if (!this.statusSocket) {
      this.statusSocket = io(`${url}/status`, {
        auth: {
          token: token,
        },
      });
    }

    // Connect to each socket
    this.chatSocket.connect();
    this.gameSocket.connect();
    this.notificationSocket.connect();
    this.statusSocket.connect();

    // Example: Add listeners to each socket
    this.chatSocket.on("connect", () => {
      console.log("Connected to chat namespace");
      // Handle further logic here
    });

    //////////////////////////////
    this.gameSocket.on("connect", () => {
      console.log("Connected to game namespace");
      // Handle further logic here
    });

    this.notificationSocket.on("connect", () => {
      console.log("Connected to notification namespace");
      // Handle further logic here
    });

    this.statusSocket.on("connect", () => {
      console.log("Connected to status namespace");
      // Handle further logic here
    });
  }

  public static getInstance(
    url?: string,
    token?: string,
    dispatch?: Dispatch
  ): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(url, token, dispatch);
    }
    return SocketManager.instance;
  }

  public getConversations(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        console.log("Socket is connected.", this.chatSocket);
        console.log("Connected to chat namespace");
        this.chatSocket?.emit("getRooms", (rooms: any) => {
          console.log("Rooms:", rooms);
          resolve(rooms);
        });
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public sendMessage(message: string, roomId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        console.log("Socket is connected.", this.chatSocket);
        console.log("Connected to chat namespace");
        this.chatSocket?.emit(
          "sendMessage",
          { message, id: roomId },
          (res: any) => {
            console.log("Rooms:", res);
            resolve(res);
          }
        );
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public getNewMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        console.log("Socket is connected.", this.chatSocket);
        this.chatSocket?.on("message", (data: any) => {
          resolve(data);
        });
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public onStartGame(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(this.gameSocket)
      if (this.gameSocket && this.gameSocket.connected) {
        console.log("Socket is connected.", this.chatSocket);
        this.chatSocket?.on("startGame", (data: any) => {
          resolve(data);
        });
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public waitForConnection(callback: () => void) {
    const checkConnection = () => {
      if (
        this.chatSocket?.connected &&
        this.gameSocket?.connected
        // this.gameSocket?.connected &&
        // this.notificationSocket?.connected &&
        // this.statusSocket?.connected
      ) {
        callback();
      } else {
        setTimeout(checkConnection, 1000);
      }
    };

    checkConnection();
  }

  // Add methods to interact with each socket if needed
}

export default SocketManager;
