import { User } from "@/app/types/user";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import axiosServices from "@/app/utils/axios";
import { useEffect, useState } from "react";

const FriendButton = ({ userId }: { userId: number | undefined }) => {
  const [userMe, setUserMe] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoadingFriendship, setIsLoadingFriendship] =
    useState<boolean>(false);
  const [friendshipStatus, setFriendshipStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axiosServices.get(`/users/me`, {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        });

        setUserMe(data.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchData();
  }, [friendshipStatus]);

  const handleFriendAction = async (
    action: "send" | "accept" | "cancel" | "unfriend" | "decline"
  ) => {
    try {
      setIsLoadingFriendship(true);

      await axiosServices.post(
        `/users/friends/${action}`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Assuming the API response includes the updated friendship status
      setFriendshipStatus(true);
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    } finally {
      setIsLoadingFriendship(false);
    }
  };

  const handleBlockAction = async (action: "block" | "unblock") => {
    try {
      setIsLoadingFriendship(true);
      console.log("Block Called");
      await axiosServices.post(
        `/users/${action}`,
        {
          id: userId,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("access_token")}`,
          },
        }
      );
      setFriendshipStatus(true);
    } catch (error) {
      console.error(`Error ${action}ing friend request:`, error);
    } finally {
      setIsLoadingFriendship(false);
    }
  };

  useEffect(() => {
    console.log("button clicked\n");
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
              <Button
                className="w-[10rem] btn btn-sm bg-yellow-500 text-gray-800 hover:bg-yellow-600"
                disabled={isLoadingFriendship}
                onClick={handleClick}
                variant="bordered"
              >
                Friend
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="flex flex-col justify-center"
              aria-label="Dynamic Actions"
            >
              <DropdownItem className="bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600">
                <button
                  className="w-[10rem] "
                  onClick={() => handleFriendAction("unfriend")}
                  disabled={isLoadingFriendship}
                >
                  Unfriend
                </button>
              </DropdownItem>
              <DropdownItem className="bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600">
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
          <Dropdown className="bg-[#1B1A2D]">
            <DropdownTrigger>
              <Button
                className="flex items-center justify-center w-[10rem] btn btn-sm bg-cyan-500 text-gray-800 hover:bg-cyan-800"
                disabled={isLoadingFriendship}
                onClick={handleClick}
                variant="bordered"
              >
                <svg
                  className="w-3 h-3 mr-1"
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
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              className="flex flex-col justify-center"
              aria-label="Dynamic Actions"
            >
              <DropdownItem className="bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600">
                <button
                  className="w-[10rem] "
                  onClick={() => handleFriendAction("accept")}
                  disabled={isLoadingFriendship}
                >
                  accept
                </button>
              </DropdownItem>
              <DropdownItem className="bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600">
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
