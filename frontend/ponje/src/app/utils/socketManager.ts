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
        } 
      }
    );

    if (this.mainSocket && !this.chatSocket) {
      this.chatSocket = io(`${url}/chat`, {
        auth: {
          token: token,
        },
      });
      console.log("chatSocket is connected.", this.chatSocket);
    }

    if (this.mainSocket && !this.gameSocket) {
      this.gameSocket = io(`${url}/game`, {
        auth: {
          token: token,
        },
        autoConnect: false,
        reconnection: false
      });
    }
    this.gameSocket?.disconnect();

    if (this.mainSocket && !this.notificationSocket) {
      this.notificationSocket = io(`${url}/notification`, {
        auth: {
          token: token,
        },
      });
      console.log("notificationSocket is connected.", this.notificationSocket);
    }

    if (this.mainSocket && !this.statusSocket) {
      this.statusSocket = io(`${url}/status`, {
        auth: {
          token: token,
        },
      });
      console.log("statusSocket is connected.", this.statusSocket);
    }

    this.mainSocket?.connect();
    this.chatSocket?.connect();
    this.notificationSocket?.connect();
    this.statusSocket?.connect();

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
  public getMainSocket(): Socket | null {
    return this.mainSocket;
  }
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

  public connectGameSocket(): void {
    if (this.mainSocket && this.gameSocket && !this.gameSocket.connected) {
      this.gameSocket.connect();
      console.log("gameSocket connected")
    }
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
        const gameFoundListener = (data: any) => {
          if (data) {
            console.log("new game found")
            resolve(data);
          }
          data = null;
          this.gameSocket?.off("gameFound", gameFoundListener);
        };
        this.gameSocket?.on("gameFound", gameFoundListener);
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public sendIntialization(payload: {gameId: number, playerPos: number, ballVel: number}): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("initialize", payload);
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    }); 
  }

  public sendPaddlePosition(payload: {gameId: number, direction: string}): Promise <any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("updatePlayerPosition", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });    
  }

  public sendScoreUpdate(payload: {gameId: number}): Promise <any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("updateScore", payload);
        console.log("send score update : ", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });    
  }

  public onScoreUpdate(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("updateScore");
      this.gameSocket?.on("updateScore", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
  }

  public onGameFinished(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {  
        const gameFinishedListener = (data: any) => {
          if (data) {
            console.log("game ended : ", data);
            resolve(data);
          }
          data = null;
          this.gameSocket?.off("gameOver", gameFinishedListener);
        };
  
        this.gameSocket?.on("gameOver", gameFinishedListener);
      } else {
        console.log("Socket is not connected yet.");
        reject("Socket is not connected");
      }
    });
  }

  public onPaddlePosition(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("updatePaddle");
      this.gameSocket?.on("updatePaddle", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
  }

  public onStartGame(): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.off("startGame");
        this.gameSocket?.on("startGame", (data: any) => {
          resolve(data);
        });
      } else {
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