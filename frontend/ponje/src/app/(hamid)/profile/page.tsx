'use client';
import Loader from "@/app/components/loader";
import axios from "@/app/utils/axios";
import { useEffect, useState } from "react";
import FriendsList from "./components/FriendsList";
import MatchHistory from "./components/MatchHistory";
import Performance from "./components/Performance";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import SkillAnalytics from "./components/SkillAnalytics";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Friends, setFriends] = useState([]);

    
    useEffect(() => {
        const fetchData = async () => {
            try {
                    const data = await axios.get(`/users/me`, {
                        headers: {
                            Authorization: `${localStorage.getItem('access_token')}`,
                        },
                    });
                    const userId = data.data.id;
                    fetchFriends(userId);
                    setUser(data.data);
                    setLoading(false);
                    console.log(data.data);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const fetchFriends = async (userId: number) => {
        try {
          const data = await axios.get(`/users/${userId}/friends`, {
            headers: {
              Authorization: `${localStorage.getItem('access_token')}`,
            },
          });
          const friends = data.data;
          setFriends(friends);
          setLoading(false);
          console.log(data.data);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };

    if (loading)
        return <Loader/>
    return (
        <div className="bg-[#151424] relative flex-grow min-h-screen p-0">
            <div>
                <PlayerBanner user={user} />
            </div>

            <div id="biggest wrapper" className="flex flex-col items-center justify-center">
                <div className="flex justify-center flex-wrap">
                    <div className="flex justify-center pl-[-8rem]">
                        <SkillAnalytics user={user} />
                        <div className="flex justify-center">
                            <Performance user={user} />
                            <ProgressBar user={user} />
                        </div>
                    </div>
                </div>
                <div className="flex justify-center flex-wrap">
                    <div className="lg:w-3/5">
                        <MatchHistory />
                    </div>
                    <div className="w-full lg:w-1/3">
                        <FriendsList users={Friends} />
                    </div>
                </div>
            </div>
        </div>
    );
}