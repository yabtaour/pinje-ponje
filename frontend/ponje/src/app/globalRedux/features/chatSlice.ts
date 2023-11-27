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
  activeConversation: Room | null;
};

const initialState: ChatState = {
  rooms: [],
  activeConversation: null,
};

export const chat = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setRooms: (state, action) => {
      state.rooms = action.payload;
      return state;
    },

    setActiveConversation: (state, action) => {
      state.activeConversation = action.payload;
      return state;
    },

    addMessage: (state, action) => {
      const { message } = action.payload;
      const room = state.rooms.find(
        (room) => room.id === message.roomId
      ) as Room;
      room.room.messages.push(message);
      return state;
    },
    addConversation: (state, action) => {
      const { conversation } = action.payload;
      state.rooms.push(conversation);
      return state;
    },
  },
});

export const { setActiveConversation, setRooms, addMessage, addConversation } =
  chat.actions;
export default chat.reducer;

// "use client";

// import { User } from "@/app/types/user";
// import { createSlice } from "@reduxjs/toolkit";
// import Conversation from "../../(hamid)/chat/components/conversation";

// type InitialState = {
//   value: {
//     rooms: RoomMember[];
//     activeConversation: RoomMember | null;
//   };
// };

// type RoomMember = {
//   id: number;
//   role: string;
//   state: string;
//   userId: number;
//   roomId: number;
//   room: Conversation;
//   members: User[];
// };

// type Conversation = {
//   id: string;
//   name: string;
//   password: string;
//   roomType: string;
//   updateAt: string;
//   createdAt: string;
//   messages: Message[];
// };
// type Message = {
//   id: string;
//   content: string;
//   roomId: number;
//   userId: number;
//   createdAt: Date;
// };

// type ChatState = {
//   rooms: RoomMember[];
// };

// const initialState = {
//   value: {
//     rooms: [],
//     activeConversation: null,
//   },
// } as InitialState;

// export const chat = createSlice({
//   name: "chat",
//   initialState,
//   reducers: {
//     setRooms: (state, action) => {
//       state.value.rooms = action.payload;
//       console.log(state.value.rooms);
//       return state;
//     },

//     setActiveConversation: (state, action) => {
//       state.value.activeConversation = action.payload;
//       console.log(state.value.activeConversation);
//       return state;
//     },

//     addMessage: (state, action) => {
//       const { message } = action.payload;
//       const room = state.value.rooms.find(
//         (room) => room.id === message.roomId
//       ) as RoomMember;
//       return state;
//     },
//     addConversation: (state, action) => {
//       const { conversation } = action.payload;
//       state.value.rooms.push(conversation);
//       return state;
//     },
//   },
// });

// export const { setActiveConversation, setRooms, addMessage, addConversation } =
//   chat.actions;
// export default chat.reducer;
