import { Dispatch } from "@reduxjs/toolkit";
import { Socket, io } from "socket.io-client";

class SocketManager {
  private static instance: SocketManager | null = null;
  private mainSocket: Socket | null = null;
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

    this.mainSocket = io(url, {
      auth: {
        token: token,
      },
    });

    if (this.mainSocket && !this.chatSocket) {
      this.chatSocket = io(`${url}/chat`, {
        auth: {
          token: token,
        },
      });

      console.log("Socket is connected.", this.chatSocket);
    }
    if (this.mainSocket && !this.gameSocket) {
      this.gameSocket = io(`${url}/game`, {
        auth: {
          token: token,
        },
      });
      console.log(" is connected.", this.chatSocket);
    }

    if (this.mainSocket && !this.notificationSocket) {
      console.log("Socket is connected.", this.chatSocket);
      this.notificationSocket = io(`${url}/notification`, {
        auth: {
          token: token,
        },
      });
    }

    if (this.mainSocket && !this.statusSocket) {
      console.log("Socket is connected.", this.chatSocket);
      this.statusSocket = io(`${url}/status`, {
        auth: {
          token: token,
        },
      });
    }

    console.log("Socket is connected.", this.mainSocket);
    this.mainSocket?.connect();
    this.chatSocket?.connect();
    this.gameSocket?.connect();
    this.notificationSocket?.connect();
    this.statusSocket?.connect();

    // Example: Add listeners to each socket
    this.chatSocket?.on("connect", () => {
      console.log("Connected to chat namespace");
      // Handle further logic here
    });

    //////////////////////////////
    this.gameSocket?.on("connect", () => {
      console.log("Connected to game namespace");
      // Handle further logic here
    });

    this.notificationSocket?.on("connect", () => {
      console.log("Connected to notification namespace");
      // Handle further logic here
    });

    this.statusSocket?.on("connect", () => {
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

  //getters
  public getChatSocket(): Socket | null {
    return this.chatSocket;
  }

  public getGameSocket(): Socket | null {
    return this.gameSocket;
  }

  public getNotificationSocket(): Socket | null {
    return this.notificationSocket;
  }

  public getStatusSocket(): Socket | null {
    return this.statusSocket;
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

  public makeConversationRead(roomId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        console.log("Socket is connected.", this.chatSocket);
        console.log("Connected to chat namespace");
        this.chatSocket?.emit("readMessages", { roomId });
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

  public onNewGame(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        console.log("Socket is connected", this.gameSocket);
        this.gameSocket?.on("gameFound", (data: any) => {
          console.log("gameFound", data);
          resolve(data);
        });
      } else {
        console.log("Socket is not conected yet.");
        reject("Socket is not connected");
      }
    })
  }

  public sendIntialization(payload: {gameId: number, playerPos: number, ballVel: number}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        console.log("Socket is connected.", this.gameSocket);
        console.log("Connected to game namespace");
        console.log(payload);
        this.gameSocket?.emit("initialize", payload);
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    }); 
  }
  

  public onStartGame(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        console.log("Socket is connected.", this.gameSocket);
        await this.gameSocket?.on("startGame", (data: any) => {
          console.log("data jaaaaaat");
          console.log("startGame", data);
          resolve(data);
          console.log(data);
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
        this.mainSocket?.connected &&
        this.chatSocket?.connected &&
        this.gameSocket?.connected &&
        this.notificationSocket?.connected
      ) {
        console.log(" All sockets connected ", this.mainSocket);
        callback();
      } else {
        setTimeout(checkConnection, 100);
      }
    };
    checkConnection();
  }
}

export default SocketManager;
