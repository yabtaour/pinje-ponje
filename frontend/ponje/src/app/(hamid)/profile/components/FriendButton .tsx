import { User } from '@/app/types/user';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';

const FriendButton = ({ userId }: { userId: number | undefined }) => {
  const [userMe, setUserMe] = useState<User | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isLoadingFriendship, setIsLoadingFriendship] = useState<boolean>(false);
  const [friendshipStatus, setFriendshipStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`http://localhost:3000/users/me`, {
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

  const handleFriendAction = async (action: 'send' | 'accept' | 'cancel') => {
    try {
      setIsLoadingFriendship(true);

      await axios.post(`http://localhost:3000/users/friends/${action}`, {
        id: userId,
      }, {
        headers: {
          Authorization: `${localStorage.getItem('access_token')}`,
        },
      });

      // Assuming the API response includes the updated friendship status
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
    setFriendshipStatus(false)
  }, [friendshipStatus])

  const handleClick = () => {
    // Perform actions when the button is clicked
    // fetchData();
    return determineFriendshipButton();
    // Add any additional actions here if needed
  };

  const determineFriendshipButton = () => {
    if (isLoading || isLoadingFriendship || !userMe) {
      // Loading state, return a loading indicator or null
      return null;
    }

    const isFriend = userMe.friendOf.some((friend: { userId: any }) => friend.userId === userId);
    const isSentRequest = userMe.sentRequest.some((request: { receiverId: any }) => request.receiverId === userId);
    const isPendingRequest = userMe.pendingRequest.some((request: { receiverId: any }) => request.receiverId === userMe.id);

    switch (true) {
      case isFriend:
        return (
          // <button className="w-[10rem] btn btn-sm btn-friend" disabled={isLoadingFriendship} onClick={handleClick}>
          //   Friend
          // </button>
          <Dropdown className='bg-[#1B1A2D]'>
            <DropdownTrigger>
              <Button
                className="w-[10rem] btn btn-sm btn-friend" disabled={isLoadingFriendship} onClick={handleClick}
                variant="bordered"
              >
                Friend
              </Button>
            </DropdownTrigger>
            <DropdownMenu className='flex flex-col justify-center' aria-label="Dynamic Actions" >
              <DropdownItem className='bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600'>
                <button className="w-[10rem] " onClick={() => handleFriendAction('cancel')} disabled={isLoadingFriendship}>
                  Unfriend
                </button>
              </DropdownItem>
              <DropdownItem className='bg-[#333153] rounded-lg text-cyan-400 hover:bg-slate-600'>
                <button className="w-[10rem]  " onClick={() => handleFriendAction('cancel')} disabled={isLoadingFriendship}>
                  Block
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>


        );
      case isSentRequest:
        return (
          <button
            className="w-[10rem] btn btn-sm btn-active btn-primary"
            onClick={() => handleFriendAction('cancel')}
            disabled={isLoadingFriendship}
          >
            Cancel Request
          </button>
        );
      case isPendingRequest:
        return (
          <button className="w-[10rem] btn btn-sm btn-pending"
            onClick={() => handleFriendAction('accept')}
            disabled={isLoadingFriendship}>
            Request Pending
          </button>
        );
      default:
        return (
          <button
            className="w-[10rem] btn btn-sm btn-active btn-primary"
            onClick={() => handleFriendAction('send')}
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
