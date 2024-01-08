"use client";

import { createSlice } from "@reduxjs/toolkit";
import produce from "immer";

type User = {
  id: number;
  username: string;
  status: string;
  profile: {
    avatar: string;
  };
};

type Message = {
  id: number;
  content: string;
  roomId: number;
  userId: number;
  createdAt: string;
  user: User;
};

type Member = {
  id: number;
  role: string;
  state: string;
  unmuteTime: string;
  userId: number;
  roomId: number;
  read: boolean;
  user: User;
};

type Room = {
  id: number;
  role: string;
  state: string;
  unmuteTime: string;
  userId: number;
  roomId: number;
  read: boolean;
  room: {
    id: number;
    name: string;
    password: string;
    roomType: string;
    updatedAt: string;
    createdAt: string;
    messages: Message[];
    members: Member[];
    // members: {
    //   user: User;
    // }[];
  };
};

type ChatState = {
  rooms: Room[];
  activeConversationId: number | null;
};

const initialState: ChatState = {
  rooms: [],
  activeConversationId: null,
};

export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
    },

    setActiveConversation: (state, action) => {
      const activeConversationId = action?.payload?.id || null;
      const roomIndex = state.rooms.findIndex(
        (room) => room?.id === action.payload?.id
      );

      if (roomIndex !== -1) {
        return produce(state, (draftState) => {
          draftState.activeConversationId = activeConversationId;
          draftState.rooms[roomIndex].read = true;
        });
      }

      return state;
    },

    addMessage: (state, action) => {
      const { roomId } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === roomId
      );

      if (roomIndex !== -1) {
        const updatedRoom = {
          ...state.rooms[roomIndex],
          room: {
            ...state.rooms[roomIndex].room,
            messages: [...state.rooms[roomIndex].room.messages, action.payload],
          },
        };

        const updatedRooms = [
          ...state.rooms.slice(0, roomIndex),
          updatedRoom,
          ...state.rooms.slice(roomIndex + 1),
        ];

        return {
          ...state,
          rooms: updatedRooms,
        };
      }

      return state;
    },

    removeMessage: (state, action) => {
      const { roomId, id } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === roomId
      );

      if (roomIndex !== -1) {
        const updatedRoom = {
          ...state.rooms[roomIndex],
          room: {
            ...state.rooms[roomIndex].room,
            messages: state.rooms[roomIndex].room.messages.filter(
              (message) => message.id !== id
            ),
          },
        };

        const updatedRooms = [
          ...state.rooms.slice(0, roomIndex),
          updatedRoom,
          ...state.rooms.slice(roomIndex + 1),
        ];

        return {
          ...state,
          rooms: updatedRooms,
        };
      }

      return state;
    },

    replaceMessage: (state, action) => {
      const { roomId, id, content } = action.payload;
      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === roomId
      );

      if (roomIndex !== -1) {
        const messageIndex = state.rooms[roomIndex].room.messages.findIndex(
          (message) => message.id === id
        );

        if (messageIndex !== -1) {
          const updatedMessage = {
            ...state.rooms[roomIndex].room.messages[messageIndex],
            content,
          };

          const updatedRoom = {
            ...state.rooms[roomIndex],
            room: {
              ...state.rooms[roomIndex].room,
              messages: [
                ...state.rooms[roomIndex].room.messages.slice(0, messageIndex),
                updatedMessage,
                ...state.rooms[roomIndex].room.messages.slice(messageIndex + 1),
              ],
            },
          };

          const updatedRooms = [
            ...state.rooms.slice(0, roomIndex),
            updatedRoom,
            ...state.rooms.slice(roomIndex + 1),
          ];

          return {
            ...state,
            rooms: updatedRooms,
          };
        }
      }

      return state;
    },

    addConversation: (state, action) => {

      const updatedRooms = [...state.rooms, action.payload];

      return {
        ...state,
        rooms: updatedRooms,
      };
    },
    addMember: (state, action) => {
      const { roomId } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === roomId
      );
      if (roomIndex !== -1) {
        const updatedRoom = {
          ...state.rooms[roomIndex],
          room: {
            ...state.rooms[roomIndex].room,
            members: [...state.rooms[roomIndex].room.members, action.payload],
          },
        };

        const updatedRooms = [
          ...state.rooms.slice(0, roomIndex),
          updatedRoom,
          ...state.rooms.slice(roomIndex + 1),
        ];

        return {
          ...state,
          rooms: updatedRooms,
        };
      }
      return state;
    },

    removeMember(state, action) {
      //paylod:
      // {
      //   id: 166,
      //   role: 'MEMBER',
      //   state: 'ACTIVE',
      //   read: false,
      //   unmuteTime: null,
      //   userId: 2,
      //   roomId: 17,
      //   user: {
      //     id: 2,
      //     username: 'donald92',
      //     profile: { avatar: 'https://placekitten.com/761/819' }
      //   }

      // }

      const { roomId, id } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === roomId
      );

      if (roomIndex !== -1) {
        const updatedRoom = {
          ...state.rooms[roomIndex],
          room: {
            ...state.rooms[roomIndex].room,
            members: state.rooms[roomIndex].room.members.filter(
              (member) => member.id !== id
            ),
          },
        };

        const updatedRooms = [
          ...state.rooms.slice(0, roomIndex),
          updatedRoom,
          ...state.rooms.slice(roomIndex + 1),
        ];

        return {
          ...state,
          rooms: updatedRooms,
        };
      }

      return state;
    },

    updateMemberState(state, action) {
      //payload = {
      // member = {}
      // state = "ACTIVE"
      // }
      const { member, newState } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === member.roomId
      );

      if (roomIndex !== -1) {
        const memberIndex = state.rooms[roomIndex].room.members.findIndex(
          (m) => m.id === member.id
        );

        if (memberIndex !== -1) {
          const updatedMember = {
            ...state.rooms[roomIndex].room.members[memberIndex],
            state: newState,
          };

          const updatedRoom = {
            ...state.rooms[roomIndex],
            room: {
              ...state.rooms[roomIndex].room,
              members: [
                ...state.rooms[roomIndex].room.members.slice(0, memberIndex),
                updatedMember,
                ...state.rooms[roomIndex].room.members.slice(memberIndex + 1),
              ],
            },
          };

          const updatedRooms = [
            ...state.rooms.slice(0, roomIndex),
            updatedRoom,
            ...state.rooms.slice(roomIndex + 1),
          ];

          return {
            ...state,
            rooms: updatedRooms,
          };
        }
      }
    },

    changeRole(state, action) {
      const { member, newRole } = action.payload;

      const roomIndex = state.rooms.findIndex(
        (room) => room?.room?.id === member.roomId
      );

      if (roomIndex !== -1) {
        const memberIndex = state.rooms[roomIndex].room.members.findIndex(
          (m) => m.id === member.id
        );
        if (memberIndex !== -1) {
          const updatedMember = {
            ...state.rooms[roomIndex].room.members[memberIndex],
            role: newRole,
          };  

          const updatedRoom = {
            ...state.rooms[roomIndex],
            room: {
              ...state.rooms[roomIndex].room,
              members: [
                ...state.rooms[roomIndex].room.members.slice(0, memberIndex),
                updatedMember,
                ...state.rooms[roomIndex].room.members.slice(memberIndex + 1),
              ],
            },
          };

          const updatedRooms = [
            ...state.rooms.slice(0, roomIndex),
            updatedRoom,
            ...state.rooms.slice(roomIndex + 1),
          ];

          return {
            ...state,
            rooms: updatedRooms,
          };
        }
      }
    },
  },
});

export const {
  addMember,
  removeMember,
  updateMemberState,
  replaceMessage,
  changeRole,
  setActiveConversation,
  setRooms,
  addMessage,
  addConversation,
} = chat.actions;
export default chat.reducer;
