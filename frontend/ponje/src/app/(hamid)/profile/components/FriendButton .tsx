import { User } from '@/app/types/user';
import { useToast } from "@chakra-ui/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useEffect, useState } from 'react';

import { useAppSelector } from '@/app/globalRedux/store';
import { getToken } from '@/app/utils/auth';
import axios from "@/app/utils/axios";
import { AxiosError } from 'axios';

const FriendButton = ({ userId }: { userId: number | undefined }) => {
  const [userMe, setUserMe] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoadingFriendship, setIsLoadingFriendship] =
    useState<boolean>(false);
  const [friendshipStatus, setFriendshipStatus] = useState(false);
  const toast = useToast();
  const newNotification = useAppSelector((state) => state.authReducer.value.newNotification);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        const data = await axios.get(`/users/me`, {
          headers: {
            Authorization: token,
          },
        });

        setUserMe(() => data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [friendshipStatus, newNotification]);

  const handleFriendAction = async (
    action: "send" | "accept" | "cancel" | "unfriend" | "decline"
  ) => {
    try {
      setIsLoadingFriendship(true);
      const token = getToken();
      await axios.post(
        `/users/friends/${action}`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );

      setFriendshipStatus(true);
    } catch (error) {
      const err = error as AxiosError;
      console.error(`Error ${action}ing friend request:`, error);
      toast({
        title: 'Error',
        description: `error while ${action}ing friend request : ${err.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
      });
    } finally {
      setIsLoadingFriendship(false);
    }
  };

  const handleBlockAction = async (action: "block" | "unblock") => {
    try {
      setIsLoadingFriendship(true);
      const token = getToken();
      await axios.post(
        `/users/${action}`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setFriendshipStatus(true);
    } catch (error) {
      const err = error as AxiosError;
      toast({
        title: 'Error',
        description: `error blocking user : ${err.message}`,
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
    });
      console.error(`Error ${action}ing friend request:`, error);
    } finally {
      setIsLoadingFriendship(false);
    }
  };

  useEffect(() => {
    // console.log("button clicked\n");
    determineFriendshipButton();
    setFriendshipStatus(false);
  }, [friendshipStatus]);

  const handleClick = () => {
    return determineFriendshipButton();
  };

  const determineFriendshipButton = () => {
    if (isLoading || isLoadingFriendship || !userMe) {
      return null;
    }

    const isFriend = userMe.friendOf.some(
      (friend: { userId: any }) => friend.userId === userId
    );
    const isSentRequest = userMe.sentRequest.some(
      (request: { receiverId: any }) => request.receiverId === userId
    );
    const isPendingRequest = userMe.pendingRequest.some(
      (request: { receiverId: any }) => request.receiverId === userMe.id
    );

    switch (true) {
      case isFriend:
        return (
          <Dropdown className="bg-[#1B1A2D]">
            <DropdownTrigger>
              <button
                className="w-[10rem] btn btn-sm btn-primary"
                disabled={isLoadingFriendship}
                onClick={handleClick}
              // variant="bordered"
              >
                Friend
              </button>
            </DropdownTrigger>
            <DropdownMenu
              className="flex flex-col justify-center"
              aria-label="Dynamic Actions"
            >
              <DropdownItem className="bg-[#333153] rounded-lg text-white hover:bg-slate-600" textValue="Unfriend">
                <button
                  className="w-[10rem] "
                  onClick={() => handleFriendAction("unfriend")}
                  disabled={isLoadingFriendship}
                >
                  Unfriend
                </button>
              </DropdownItem>
              <DropdownItem className="bg-[#EF4C53] rounded-lg text-white hover:bg-slate-600" textValue="block">
                <button
                  className="w-[10rem]  "
                  onClick={() => handleBlockAction("block")}
                  disabled={isLoadingFriendship}
                >
                  Block
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case isPendingRequest:
        return (
          <Dropdown className="bg-[#1B1A2D] ">
            <DropdownTrigger>
              <button
                className="flex items-center flex-col text-xs justify-center w-[10rem] btn btn-sm bg-[#23a3c3] btn-primary text-white"
                disabled={isLoadingFriendship}
                onClick={handleClick}
              >
                <svg
                  className="w-3 h-3 "
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span className="truncate">Pending Request</span>
              </button>
            </DropdownTrigger>
            <DropdownMenu
              className="flex flex-col justify-center"
              aria-label="Dynamic Actions"
            >
              <DropdownItem className="bg-green-500  rounded-lg text-white hover:bg-slate-600" textValue="accept">
                <button
                  className="w-[10rem] "
                  onClick={() => handleFriendAction("accept")}
                  disabled={isLoadingFriendship}
                >
                  accept
                </button>
              </DropdownItem>
              <DropdownItem className="bg-red-500 rounded-lg text-white hover:bg-slate-600" textValue="decline">
                <button
                  className="w-[10rem]  "
                  onClick={() => handleFriendAction("decline")}
                  disabled={isLoadingFriendship}
                >
                  decline
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      case isSentRequest:
        return (
          <button
            className="w-[10rem] btn btn-sm btn-active btn-primary"
            onClick={() => handleFriendAction("cancel")}
            disabled={isLoadingFriendship}
          >
            Cancel Request
          </button>
        );
      default:
        return (
          <button
            className="w-[10rem] btn btn-sm btn-active btn-primary"
            onClick={() => handleFriendAction("send")}
            disabled={isLoadingFriendship}
          >
            Add Friend
          </button>
        );
    }
  };

  return handleClick();
};

export default FriendButton;
