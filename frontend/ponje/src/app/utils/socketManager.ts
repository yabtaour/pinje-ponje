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
    }

    if (this.mainSocket && !this.gameSocket) {
      this.gameSocket = io(`${url}/game`, {
        auth: {
          token: token,
        },
      });
    }

    if (this.mainSocket && !this.notificationSocket) {
      this.notificationSocket = io(`${url}/notification`, {
        auth: {
          token: token,
        },
      });
     
    }

    if (this.mainSocket && !this.statusSocket) {
      this.statusSocket = io(`${url}/status`, {
        auth: {
          token: token,
        },
      });
  
    }
    this.mainSocket?.connect();
    this.chatSocket?.connect();
    this.notificationSocket?.connect();
    this.statusSocket?.connect();

    this.chatSocket?.on("connect", () => {
      // Handle further logic here
    });

    //////////////////////////////
    this.gameSocket?.on("connect", () => {
      // Handle further logic here
    });

    this.notificationSocket?.on("connect", () => {
      // Handle further logic here
    });

    this.statusSocket?.on("connect", () => {
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
    }
  }

  //catch socketErrors

  public catchErrors(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.mainSocket && this.mainSocket.connected) {
        this.mainSocket?.off("ErrorEvent");
        this.chatSocket?.off("ErrorEvent");
        this.gameSocket?.off("ErrorEvent");

        this.mainSocket?.on("ErrorEvent", (error: any) => {
          reject(error);
        });
        this.chatSocket?.on("ErrorEvent", (error: any) => {
          reject(error);
        });
        this.gameSocket?.on("ErrorEvent", (error: any) => {
          reject(error);
        });
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public async getNotifications(callback: () => void) {
    if (this.notificationSocket && this.notificationSocket.connected) {

      this.notificationSocket?.off("notification");
      this.notificationSocket?.on("notification", (notifications: any) => {

        callback();
      });
    } 
  }

  public async getConversations(): Promise<any[]> {
   
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        this.chatSocket?.emit("getRooms", (rooms: any) => {
          //get rooms members
          resolve(rooms);
        });
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public listenOnUpdates(callback: (data: any) => void) {
    if (this.chatSocket && this.chatSocket.connected) {
      this.chatSocket?.off("roomBroadcast");
      this.chatSocket?.on("roomBroadcast", (updatedMember: any) => {
        callback(updatedMember);
      });
    } 
  }

  public joinRoom(roomId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        this.chatSocket?.emit("joinRoom", { roomId }, (res: any) => {
          resolve(res);
        });
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public onroomJoined(): Promise<any> {
    return new Promise((resolve, reject) => {});
  }

  public sendMessage(
    message: string,
    roomId: number,
    state?: string
  ): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        this.chatSocket?.emit(
          "sendMessage",
          { message, id: roomId, state },
          (res: any) => {
            resolve(res);
          }
        );
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public makeConversationRead(roomId: number): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.chatSocket && this.chatSocket.connected) {
        this.chatSocket?.emit("readMessages", { roomId });
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public getNewMessages(callback: () => void) {
    if (this.chatSocket && this.chatSocket.connected) {
      this.chatSocket?.off("message");
      this.chatSocket?.on("message", () => {
        callback();
      });
    } else {
    }
  }



  public onNewGame(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("gameFound");
      this.gameSocket?.on("gameFound", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
  }

  public sendIntialization(payload: {
    gameId: number;
    playerPos: number;
    ballVel: number;
  }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("initialize", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public sendPaddlePosition(payload: {
    gameId: number;
    direction: string;
  }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("updatePlayerPosition", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }


  public sendGameEnd(payload: { gameId: number; enemy: number }) {
    return new Promise((resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("finishGame", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public sendScoreUpdate(payload: { gameId: number }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("updateScore", payload);
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

  public onGameFinished(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("gameOver");
      this.gameSocket?.on("gameOver", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
  }

  public onStartGame(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("startGame");
      this.gameSocket?.on("startGame", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
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

  public onBallUpdate(callback: (data: any) => void): void {
    if (this.gameSocket && this.gameSocket.connected) {
      this.gameSocket?.off("updateBall");
      this.gameSocket?.on("updateBall", (data: any) => {
        callback(data);
      });
    } else {
      console.error("Socket is not connected");
    }
  }

  public sendTestingSendBallUpdate(payload: {
    gameId: number;
    position: any;
    velocity: any;
    edge: string;
    worldWidth: number;
  }) {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("testingBallUpdate", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }

  public sendBallUpdate(payload: {
    gameId: number;
    position: any;
    velocity: any;
    edge: string;
    worldWidth: number;
  }): Promise<any> {
    return new Promise(async (resolve, reject) => {
      if (this.gameSocket && this.gameSocket.connected) {
        this.gameSocket?.emit("updateBallPosition", payload);
        resolve("done");
      } else {
        reject("Socket is not connected");
      }
    });
  }

  // public onStartGame(): Promise<any> {
  //   return new Promise(async (resolve, reject) => {
  //     if (this.gameSocket && this.gameSocket.connected) {
  //       this.gameSocket?.off("startGame");
  //       this.gameSocket?.on("startGame", (data: any) => {
  //         resolve(data);
  //       });
  //     } else {
  //       reject("Socket is not connected");
  //     }
  //   });
  // }

  public waitForConnection(callback: () => void) {
    const checkConnection = () => {
      if (
        this.mainSocket?.connected &&
        this.chatSocket?.connected &&
        this.gameSocket?.connected &&
        this.notificationSocket?.connected
      ) {
        callback();
      } else {
        setTimeout(checkConnection, 100);
      }
    };
    checkConnection();
  }
}

export default SocketManager;
