import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection, OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { GlobalExceptionFilter } from 'src/global-exception.filter';
import { ChatService, joinRoomDto } from './chat.service';
import { chatActionsDto } from './dto/actions-dto';
import { CreateChatDmRoomDto } from './dto/create-chat.dto';
import { AuthWithWs } from './dto/user-ws-dto';

/**
 * WebSocket Gateway for handling chat-related events.
 * 
 */

@UsePipes(new ValidationPipe())
@UseFilters(new GlobalExceptionFilter())
@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Namespace;
  constructor(private readonly chatService: ChatService) {}
  logger: Logger = new Logger('Chat Gateway');
  
  afterInit(server: Server) {
    this.logger.log('Chat Gateway Initialized');
  }

  /**
   * Handles a new WebSocket client connection.
   * @param client The WebSocket client [ Socket ].
   */
  async handleConnection(client: AuthWithWs) {
    const sockets = this.server.sockets;

    const userRooms = await this.chatService.getRoomsByUserId(parseInt(client.id), {skip: 0});
  
    userRooms.forEach((rooms) => {
      console.log(rooms)
      this.logger.debug(`Client ${client.id} joined room ${rooms.room.name}`);
      client.join(String(rooms.room.id));
    });
  
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);
    this.logger.log(`Client connected: `, client.id);
  }

  /**
   * Handles a WebSocket client disconnect.
   * @param client The WebSocket client [ Socket ].
   */

  async handleDisconnect(client: AuthWithWs) {
    const sockets = this.server.sockets;

    this.logger.log(`Disconnected socket id: `, client.id);
    this.logger.debug(`Number of connected sockets: ${sockets.size}`);

    const userRooms = await this.chatService.getRoomsByUserId(parseInt(client.id), {skip: 0});
  
    userRooms.forEach((rooms) => {
      this.logger.debug(`Client ${client.id} leave room ${rooms.room.name}`);
      client.leave(String(rooms.room.id));
    });

  }
  
  /**
   * Handles The Creation of a new Room.
   * @param client The WebSocket client [ Socket ].
   * @param payload The Room Creation Data [ CreateChatDmRoomDto {"name": "room", "type": "PROTECTED", "password(?)": "123", "role": "MEMBER" ].
   */

  @SubscribeMessage('createRoom')
  async handleCreateRoom(client: any, payload: CreateChatDmRoomDto){
    console.log("user id : ", client.id);
    const room = await this.chatService.createRoom(parseInt(client.id), payload);
    client.join(String(room.id));
    this.server.to(String(room.id)).emit('roomCreated', room);
  }

  /**
   * Returns a list of all rooms for the user with the given id.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { skip: 0, take: 10, cursor: { id: 1 }, where: { name: 'room' } } ].
   *
   * @returns A list of rooms.
   * @throws {Error} If the user with the given id does not exist.
   * @throws {Error} If the given search parameters are invalid.
   */
  
  @SubscribeMessage('getRooms')
  async handleGetRooms(client: AuthWithWs, payload: any) {
    console.log("The User ID Requesting Rooms : ", client.id)
    const rooms = await this.chatService.getRoomsByUserId(parseInt(client.id), client.handshake.query);
    // this.server.to(String(payload.id)).emit('listOfRooms', rooms););
    return rooms;
  }
  
  /**
   * Returns the room with the given name.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid' } ].
   *
   * @returns The room with the given name.
   * @throws {Error} If the room with the given name does not exist.
   */

  @SubscribeMessage('getRoom')
  async handleGetRoom(client: AuthWithWs, payload: any) {
    const room = await this.chatService.getRoomByNames(payload.id);
    console.log("room : ", room);
    this.server.to(String(payload.id)).emit('roomDetails', room);
  }


  /**
   * Join a user to a room.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid' } ].
   * @returns The room with the given name.
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is already a member of the room.
   */
  
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(client: AuthWithWs, payload: joinRoomDto) {
    console.log("payload : ", payload);
    const room = await this.chatService.joinRoom(parseInt(client.id), payload, payload.roomId);
    client.join(String(payload.roomId));
    this.server.to(String(payload.roomId)).emit('roomJoined', room);
    const message = "New User " +  client.id + " Joined Room " + String(payload.roomId);
    this.server.to(String(payload.roomId)).emit('roomBroadcast', message);
  }

  /**
   * Returns a list of all users in the room with the given name.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid' } ].
   * @returns A list of users.
   * @throws {Error} If the room with the given name does not exist.
   */

  @SubscribeMessage('getRoomUsers')
  async handleGetRoomUsers(client: any, payload: any) {
    const users = await this.chatService.getRoomUsers(client, payload.id, client.handshake.query);
    this.server.to(String(payload.id)).emit('listOfRoomMembers', users);
  }

  /**
   * Kick a user from a room.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid', userId: 1 } ].
   * @returns The room with the given name.
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is not a member of the room.
   */

  @SubscribeMessage('kick')
  async handleKick(client: AuthWithWs, payload: any) {
    const room = await this.chatService.kickUserFromRoom(parseInt(client.id), payload);
    this.server.to(String(payload.id)).emit('roomBroadcast', "User Kicked");
  }

  /**
   * Ban a user from a room.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid', userId: 1 } ].
   * @returns The room with the given name.
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is not a member of the room.
   */

  @SubscribeMessage('mute')
  async handleMute(client: AuthWithWs, payload: any) {
    const room = await this.chatService.MuteUserFromRoom(parseInt(client.id), payload);
    this.server.to(String(payload.id)).emit('roomBroadcast', "User Muted");
  }


  @SubscribeMessage('unmute')
  async handleunMute(client: AuthWithWs, payload: any) {
    const room = await this.chatService.unMuteUser(parseInt(client.id), payload);
    this.server.to(String(payload.id)).emit('roomBroadcast', "User unmuted");
  }

  /**
   * Ban a user from a room.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { id: 'roomid', userId: 1 } ].
   * @returns The room with the given name. and emit to [ roomBroadcast ].
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is not a member of the room.
   */

  @SubscribeMessage('ban')
  async handleBan(client: AuthWithWs, payload: chatActionsDto) {
    const room = await this.chatService.BanUserFromRoom(parseInt(client.id), payload);
    this.server.emit('roomBroadcast', "User Banned");
    this.server.to(String(payload.id)).emit('roomBroadcast', "User Banned");
  }

  @SubscribeMessage('unban')
  async handleUnban(client: AuthWithWs, payload: chatActionsDto){
    const room = await this.chatService.UnBanUserFromRoom(parseInt(client.id), payload);
    this.server.to(String(payload.id)).emit('roomBroadcast', "User Unbanned");
  }

  /**
   * Sends a message to a room.
   * @param client The WebSocket client [ Socket ].
   * @param payload payload [ { id: 'roomid', message: 'hello' } ].
   * @returns The message.
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is not a member of the room.
   * @throws {Error} If the user is muted in the room.
   * @throws {Error} If the user is banned from the room.
   * @throws {Error} If the user is not authenticated.
   * @returns The message.
    */

  @SubscribeMessage('sendMessage')
  async handleMessage(client: AuthWithWs, payload: any){
    const message = await this.chatService.createMessage(parseInt(client.id) , parseInt(payload.id), payload);
    console.log("message : ", message);
    if (message)
      this.server.to(String(payload.id)).emit('message', message);
  }


  /**
   * Returns a list of all messages in the room with the given name.
   * @param client The WebSocket client [ Socket ].
   * @param payload Search parameters [ { name: 'room' } ].
   * @returns A list of messages.
   * @throws {Error} If the room with the given name does not exist.
   * @throws {Error} If the user is not a member of the room.
   * @throws {Error} If the user is not authenticated.
   * @returns A list of messages.
    */

  @SubscribeMessage('getMessages')
  async handleGetMessages(client: AuthWithWs, payload: any){
    const messages = await this.chatService.getMessages(parseInt(client.id), parseInt(payload.id), client.handshake.query);
    this.server.to(String(client.id)).emit('listOfMessages', messages);
  }
}


/**
 * 
 * Events       : [ listen      ] desc.
 * ------------------------------------------------------------ [ server side ]
 * 
 * creatRoom    : [ server side ] to create a room.
 * 
 * getRooms     : [ server side ] to get all the rooms
 * 
 * getRoom      : [ server side ] to get x room details
 * 
 * joinRoom     : [ server side ] to join a room
 * 
 * getRoomUsers : [ server side ] to get all the memebers of a room
 * 
 * kick         : [ server side ] to kick a user from a room
 * 
 * mute         : [ server side ] to mute a user from a room
 * 
 * ban          : [ server side ] to ban a user from a room
 * 
 * unban        : [ server side ] to unban a user from a room
 * 
 * sendMessage  : [ server side ] to send a message to a room
 * 
 * getMessages  : [ server side ] to get all the messages of a room
 * 
 * 
 * ------------------------------------------------------------ [ client side ]
 * 
 * roomCreated  : [ client side ] retrive the new Room Details.
 * 
 * listOfRooms  : [ client side ] retrive All the rooms for the user
 * 
 * roomDetails  : [ client side ] retrive All the x room details
 * 
 * roomJoined   : [ client side ] details about new room user joind
 * 
 * listOfRoomMembers  : [ client side ] retrive All members of a room
 * 
 * roomBroadcast: brodcast for room that user has joind or kicked or banned etc..
 * 
 * ErrorEvent   : [ client side ] retrive the error message
 * 
 * message      : [ client side ] retrive the message
 * 
 * listOfMessages: [ client side ] retrive All messages of a room
 * 
 * 
 * 
 */



// to do :
// leave rooms 
// uban users from room
// mute users from room (done)
// kick users from room (done)
// ban users from room (done)
// join rooms (done)
// create rooms (done)
// get rooms (done)
// get room details (done)
// get room users (done)
// send messages (done)
// get messages (done)


