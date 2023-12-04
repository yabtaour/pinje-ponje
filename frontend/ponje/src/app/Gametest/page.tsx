'use client'
import Rules from './components/Rules'
import OnlineFriendsInvite from './components/onlineFriendsInvite'
import PlayerCard from './components/PlayerCard'
import axios from "@/app/utils/axios";
import { useEffect, useState } from 'react'
import Loader from '../components/loader'
import { User } from '../../app/types/user';

export default function Gametest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onlineFriends, setOnlineFriends] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await axios.get(`/users/me`, {
          headers: {
            Authorization: `${localStorage.getItem('access_token')}`,
          },
        });
        setUser(data.data);
        setLoading(false);
        console.log(data.data);        
        const loggedUserId = data.data.id;
        fetchOnlineFriends(loggedUserId);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchOnlineFriends = async (userId : number) => {
    try {
      const data = await axios.get(`/users/${userId}/friends`, {
        headers: {
          Authorization: `${localStorage.getItem('access_token')}`,
        },
      });
      const friends = data.data.filter((friend : User) => friend.status === 'ONLINE');
      setOnlineFriends(friends);
      setLoading(false);
      console.log(data.data);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }


      return (
        <div className=' min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321]'>
          <div className='grid grid-cols-3'>
            <div></div>
            <PlayerCard user={user} />
            <OnlineFriendsInvite users={onlineFriends} />
            {/* <Rules /> */}
          </div>
        </div>
      );
    }

