'use client';
import axios from "@/app/utils/axios";
import { useToast } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setNewNotification } from "../globalRedux/features/authSlice";
import { User } from "../types/user";
import { getToken } from "../utils/auth";
import { AxiosError } from "axios";


interface Notification {
  id: number;
  senderid: number;
  receiverid: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  name: string;
  avatar: string;
  notifId: number;
}

export default function Notification({ user }: { user: User | null | undefined }) {

  const [notifs, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const dispatch = useDispatch();



  const formatDate = React.useCallback((dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const delta = now.getTime() - date.getTime();

    if (delta < 60 * 1000) {
      return "a second ago";
    } else if (delta < 3600 * 1000) {
      return `${Math.floor(delta / (60 * 1000))} minutes ago`;
    } else if (delta < 24 * 3600 * 1000) {
      return `${Math.floor(delta / (3600 * 1000))} hours ago`;
    } else if (delta < 48 * 3600 * 1000) {
      return "yesterday";
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
    }
  }, []);


  const changeReadStatus = async (id: number) => {
    const notification = notifs.find((n) => n.id === id);
    if (notification && notification.read) {
      return;
    }
    try {

      const readres = await axios.post(`/notification/read/${id}`, {
        headers: {
          Authorization: getToken(),
        },
      });

      if (readres.status === 201) {
        dispatch(setNewNotification(false));
      }

    }
    catch (error) {
      toast({
        title: 'Error',
        description: "notification status change error",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
      });
    }
  }

  const getUserById = async (userId: number) => {
    try {
      const response = await axios.get(`/users/${userId}`, {
        headers: {
          Authorization: getToken(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: "error while getting user information",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
      });
      return null;
    }
  }

  useEffect(() => {

    const getMyNotifications = async () => {
      try {
        const response = await axios.get(`/notification/my`, {
          headers: {
            Authorization: getToken(),
          },
        });

        const notificationsWithUser = await Promise.all(
          response.data.map(async (notification: Notification) => {
            try {
              const user = await getUserById(notification.senderid);
              const frens = await areFriends(notification.receiverid, user?.id);
              if (
                notification.type === "FRIEND_REQUEST" && frens
              ) {
                await changeReadStatus(notification.id);
                return null;
              }

              return {
                ...notification,
                name: user?.username || 'Unknown',
                avatar: user?.avatar || '/placeholderuser.jpeg',
                createdAt: formatDate(notification.createdAt),
                treated: false,
              } as Notification;
            } catch (error) {
              const err = error as AxiosError;
              toast({
                title: 'Error',
                description: `Error while getting user by id : ${err}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
                colorScheme: "red",
              });
              console.error("Error fetching user information", error);
              return null;
            }
          })
        );

        setNotifications(notificationsWithUser.filter(Boolean));
        setLoading(false);
      } catch (err) {
        setLoading(false);
        toast({
          title: 'Error',
          description: "Error getting notifications",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
      }
    };

    const areFriends = async (userId: number, friendId: number) => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/friends`, {
          headers: {
            Authorization: getToken(),
          },
        });

        const friendIds = response.data.map((friend: any) => friend.id);

        return friendIds.includes(friendId);
      } catch (error) {
        console.error("Error checking if users are friends", error);
        return false; // Return false in case of an error
      }
    };


    getMyNotifications();
  }, []);


  const renderNotifications = () => {
    if (loading) {
      return (
        <div className='flex justify-center items-center flex-col'>
          <span className="loading loading-bars loading-xs md:loading-sm text-primary"></span>
          <p className='text-primary'>fetching Notifications</p>
        </div>
      );
    }

    if (notifs.length === 0) {
      return <p>No notifications for this user.</p>;
    }
    return (
      <div
        style={{ maxHeight: '400px', overflow: 'auto', margin: '0 rem' }}
        className="mb-0.5 p-0"
      >
        {notifs
          .filter((notification) => !notification.read)
          .slice()
          .reverse()
          .sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          })
          .map((notification) => (
            <NotificationComponent
              key={notification.id}
              id={notification.senderid}
              name={notification.name}
              type={notification.type}
              avatar={notification.avatar}
              createdAt={notification.createdAt}
              setNotifications={setNotifications}
              notifs={notifs}
              notifId={notification.id}
            />
          ))}
      </div>
    );

  };

  return (
    <div>
      {renderNotifications()}
    </div>
  );
}


export const NotificationComponent = ({ id, name, type, avatar, createdAt, setNotifications, notifs, notifId }:
  { id: number, name: string, type: string, avatar: string, createdAt: string, setNotifications: any, notifs: any, notifId: number }) => {
  const toast = useToast();
  const router = useRouter();


  const changeReadStatus = async (id: number) => {

    try {
      const readres = await axios.post(`/notification/read/${id}`, {
        headers: {
          Authorization: getToken(),
        },
      });

      if (readres.status === 201) {
      }

    }
    catch (error) {
      toast({
        title: 'Error',
        description: "notification status change error",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
      });
    }
  }
  const handleAccept = async (type: string, id: number, notifId: number) => {
    if (type === "FRIEND_REQUEST") {
      try {
        const res = await axios.post('/users/friends/accept', {
          headers: {
            Authorization: getToken(),
          },
          id: id,
        });
        if (res.status === 201) {
          await changeReadStatus(notifId);
          toast({
            title: 'Success',
            description: "friend request accepted",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
            colorScheme: "green",
          });

        }
      }
      catch (error) {
        const err = error as AxiosError;
        toast({
          title: 'Error',
          description: `friend accept error : ${err}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.error("friend accept error", error);
      }
    }
    else {
      try {
        router.push('/pong/versusScreen');
        setTimeout(async () => {
          const res = await axios.post('/game/accept', {
            userId: id,
            headers: {
              Authorization: getToken(),
            },
          });
          await changeReadStatus(notifId);
          if (res.status === 201) {
            toast({
              title: 'Success',
              description: "game request accepted",
              status: 'success',
              duration: 9000,
              isClosable: true,
              position: "bottom-right",
              variant: "solid",
              colorScheme: "green",
            });
          }
        }, 2000);
      }
      catch (error) {
        const err = error as AxiosError;
        toast({
          title: 'Error',
          description: `game accept error : ${err}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.error("game accept error", error);
      }

    }
  };

  const handleReject = async (type: string, id: number, notifId: number) => {
    if (type === "FRIEND_REQUEST") {
      try {
        const res = await axios.post('/users/friends/decline', {
          headers: {
            Authorization: getToken(),
          },
          id: id,
        });
        await changeReadStatus(notifId);
        if (res.status === 201) {
          toast({
            title: 'Success',
            description: "friend request rejected",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
            colorScheme: "green",
          });
        }
      } catch (error) {
        const err = error as AxiosError;
        toast({
          title: 'Error',
          description: `friend reject error : ${err}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.error("friend reject error", error);
      }
    }
    else if (type === "GAME_INVITE") {
      try {
        const res = await axios.post('/game/decline', {
          headers: {
            Authorization: getToken(),
          },
          userId: id,
        });
        await changeReadStatus(notifId);
        if (res.status === 201) {
          toast({
            title: 'Success',
            description: "game request rejected",
            status: 'success',
            duration: 9000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
            colorScheme: "green",
          });
        }
      } catch (error) {
        const err = error as AxiosError;
        toast({
          title: 'Error',
          description: `game request reject error : ${err}`,
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.error("game reject error", error);
      }
    }
  }

  return (
    <div className="w-full p-3 mt-1 bg-[#323054] rounded flex flex-col md:flex-row">
      <div tabIndex={0} aria-label="player icon" role="img" className="focus:outline-none flex items-center justify-center mb-4 md:mr-4 md:mb-0">
        <Image
          src={avatar}
          alt="player icon"
          className="rounded"
          width={50}
          height={50}
        />
      </div>
      <div>
        <p tabIndex={0} className="focus:outline-none text-sm leading-none mb-2">
          <span className="text-[#74E0F5]">{name}</span>
          <span className="text-white">
            {type === "FRIEND_REQUEST" && " sent you a friend request"}
            {type === "FRIEND_REQUEST_ACCEPTED" && " accepted your friend request"}
            {type === "GAME_INVITE" && " sent you a game invite"}
            {type === "GAME_INVITE_REJECTED" && " rejected your game invite"}
            {type === "GROUP_CHAT_INVITE" && " sent you a group chat invite"}
          </span>
        </p>
        <p className="text-[#C6BCBC] text-xs">{createdAt}</p>
        {(type === "FRIEND_REQUEST" || type === "GAME_INVITE") ? (
          <div className="flex space-x-1 pt-2">
            <>
              <button className="btn btn-xs btn-active h-7 bg-[#323054] hover:bg-green-300 hover:border-green-700 text-green-500 border-green-300" onClick={(e) => handleAccept(type, id, notifId)}> Accept
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 52 41" fill="none">
                  <path d="M46.0543 0.387695L17.7834 28.6919L6.11261 17.0544L0.220947 22.946L17.7918 40.4752L51.948 6.27936L46.0543 0.387695Z" fill="#4CAF50" />
                </svg>
              </button>
              <button className="btn btn-xs btn-active h-7 bg-[#323054] hover:bg-red-300 hover:border-red-700 text-red-500 border-red-300" onClick={(e) => handleReject(type, id, notifId)}> Reject
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 100 100" fill="none">
                  <path d="M20.0632 74.0879L74.2738 19.8754L80.1665 25.7679L25.9559 79.9803L20.0632 74.0879Z" fill="#D50000" />
                  <path d="M49.9999 8.33301C27.0833 8.33301 8.33325 27.083 8.33325 49.9997C8.33325 72.9163 27.0833 91.6663 49.9999 91.6663C72.9166 91.6663 91.6666 72.9163 91.6666 49.9997C91.6666 27.083 72.9166 8.33301 49.9999 8.33301ZM49.9999 83.333C31.6666 83.333 16.6666 68.333 16.6666 49.9997C16.6666 31.6663 31.6666 16.6663 49.9999 16.6663C68.3333 16.6663 83.3332 31.6663 83.3332 49.9997C83.3332 68.333 68.3333 83.333 49.9999 83.333Z" fill="#D50000" />
                </svg>
              </button>
            </>
          </div>
        ) : null}
      </div>
    </div>
  );
}

