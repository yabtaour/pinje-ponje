'use client'
import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import { getGameData } from '@/app/utils/update';
import { useToast } from "@chakra-ui/react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Loader from '../../components/loader';
import { User } from '../../types/user';
import PlayerCard from "./components/PlayerCard";
import Rules from "./components/Rules";
import OnlineFriendsInvite from "./components/onlineFriendsInvite";



export default function Pong() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [gameDataFetched, setGameDataFetched] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleMMClick = () => {
    router.push('/pong/versusScreen');
    setTimeout(() => {
      if (!gameDataFetched) {
        getGameDataHandler();
      }
    }, 2000)
  };

  const getGameDataHandler = async () => {
    const token = getToken();
    if (!token) {
      console.error('Access token not found in Cookies');
      return;
    }
    setGameDataFetched(true);
    try {
      const data = await getGameData(token);
      console.log('GameData:', data);
    } catch (err) {
      toast({
        title: 'Error',
        description: "Game data fetch error",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
        colorScheme: "red",
      });
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getToken();
        if (!token) {
          console.error('Access token not found in Cookies');
          return;
        }
        const data = await axios.get(`/users/me`, {
          headers: {
            authorization: token,
          },
        });
        console.log(data.data);
        setUser(data.data);
        setLoading(false);
        const loggedUserId = data.data.id;
        fetchOnlineFriends(loggedUserId);
      } catch (err) {
        toast({
          title: "Error.",
          description: "Error while fetching friends",
          status: "error",
          duration: 3000,
          isClosable: true,
        })
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOnlineFriends = async (userId: number) => {
    try {

      const token = getToken();
      if (!token) {
        console.error('Access token not found in Cookies');
        return;
      }
      const data = await axios.get(`/users/${userId}/friends`, {
        headers: {
          Authorization: token,
        },
      });
      const friends = data.data.filter((friend: User) => friend.status === 'ONLINE');
      setOnlineFriends(friends);
      setLoading(false);
      console.log(data.data);
    } catch (err) {
      toast({
        title: 'Error',
        description: "error while gettinge friends",
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: "bottom-right",
        variant: "solid",
      });
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {

    return (
      <div className='min-h-screen'>
        <Loader />;
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321]'>
      <div className='grid grid-cols-3'>
        <div></div>
        <div className="flex items-center justify-center h-screen lg:col-span-1">
          <div className="grid grid-cols-1 items-center">
            <PlayerCard user={user} cardColor="#4A40BF" />
            <button className="btn  lg:h-12 bg-[#4E40F4] mt-10 mb-10 text-xs lg:text-sm" onClick={handleMMClick}>
              Join matchmaking
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="ml-2 w-4 h-4 md:w-8 md:h-8 hidden lg:block">
                <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.55 2 2.5 8.05 2.5 15.5C2.5 22.95 8.55 29 16 29C16.53 29 17.051 28.962 17.566 28.902L17.582 28.918L17.6 28.898C24.296 28.105 29.5 22.408 29.5 15.5C29.5 8.593 24.296 2.9 17.602 2.105C17.585 2.091 17.57 2.075 17.552 2.061V2.055L17.522 2.092C17.021 2.035 16.514 2 16 2ZM15.5 3.025V8H11.16C12.077 6.057 13.334 4.372 14.836 3.059C15.055 3.039 15.278 3.034 15.5 3.025ZM16.5 3.025C16.723 3.035 16.947 3.038 17.166 3.059C18.671 4.372 19.931 6.054 20.85 8H16.5V3.025ZM13.076 3.357C11.8117 4.72297 10.7873 6.29273 10.046 8H6.015C7.75713 5.67785 10.2535 4.03592 13.076 3.357ZM18.922 3.357C21.7453 4.03541 24.2434 5.67741 25.986 8H21.96C21.2167 6.29216 20.1889 4.72235 18.922 3.357ZM5.336 9H9.646C8.94326 10.9247 8.56086 12.9516 8.514 15H3.525C3.60535 12.8781 4.22953 10.8123 5.336 9ZM10.738 9H15.5V15H9.514C9.56888 12.9439 9.98313 10.9133 10.738 9ZM16.5 9H21.27C22.025 10.9133 22.4392 12.9439 22.494 15H16.5V9ZM22.36 9H26.664C27.7705 10.8123 28.3937 12.8781 28.474 15H23.494C23.4462 12.9514 23.0628 10.9245 22.359 9H22.36ZM3.524 16H8.513C8.55979 18.0484 8.94219 20.0753 9.645 22H5.334C4.22809 20.1875 3.60527 18.1217 3.525 16H3.524ZM9.513 16H15.5V22H10.738C9.98315 20.0867 9.5689 18.0561 9.514 16H9.513ZM16.499 16H22.468C22.362 17.883 21.848 19.953 20.95 22H16.5L16.499 16ZM23.469 16H28.474C28.3937 18.1217 27.7709 20.1875 26.665 22H22.036C22.879 19.97 23.371 17.916 23.469 16ZM6.015 23H10.048C10.7893 24.7073 11.8137 26.277 13.078 27.643C10.2543 26.965 7.75565 25.323 6.013 23H6.015ZM11.161 23H15.501V27.975C15.28 27.965 15.057 27.961 14.839 27.941C13.335 26.628 12.079 24.945 11.161 23ZM16.501 23H20.464C19.5719 24.7929 18.4406 26.4564 17.101 27.945C16.903 27.963 16.701 27.967 16.501 27.975V23ZM21.589 23H25.987C24.1797 25.4155 21.5581 27.0942 18.608 27.725C19.7872 26.2754 20.7874 24.6889 21.587 23H21.589Z" fill="white" />
                <circle cx="23" cy="11" r="2" fill="#77DFF8" />
                <circle cx="9" cy="17" r="2" fill="#77DFF8" />
                <circle cx="23" cy="23" r="2" fill="#77DFF8" />
              </svg>
            </button>
          </div>
        </div>
        <div className="hidden lg:flex items-center justify-center col-span-1">
          <div className="flex items-center justify-center flex-col">
            <Rules />
            <OnlineFriendsInvite users={onlineFriends} />
          </div>
        </div>
      </div>
      <div className="lg:hidden flex items-center justify-center flex-col">
        <Rules />
        <OnlineFriendsInvite users={onlineFriends} />
      </div>
    </div>
  );

}