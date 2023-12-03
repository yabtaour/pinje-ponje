"use client";

import { createSlice } from "@reduxjs/toolkit";

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

type Room = {
  id: number;
  role: string;
  state: string;
  unmuteTime: string;
  userId: number;
  roomId: number;
  room: {
    id: number;
    name: string;
    password: string;
    roomType: string;
    updatedAt: string;
    createdAt: string;
    messages: Message[];
    members: {
      user: User;
    }[];
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
      state.activeConversationId = action.payload?.id || null;
    },
    addMessage: (state, action) => {
      const { roomId } = action.payload;

      console.log(action);
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
    addConversation: (state, action) => {
      const { conversation } = action.payload;
      state.rooms.push(conversation);
    },
  },
});

export const { setActiveConversation, setRooms, addMessage, addConversation } =
  chat.actions;
export default chat.reducer;
