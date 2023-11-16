'use client';

import axios from "@/app/utils/axios";
import { useEffect, useState } from "react";
import FriendsList from '../components/FriendsList';
import MatchHistory from "../components/MatchHistory";
import Performance from "../components/Performance";
import PlayerBanner from "../components/PlayerBanner";
import ProgressBar from "../components/ProgressBar";
import SkillAnalytics from "../components/SkillAnalytics";

export default function Profile({ params }: { params: { id: number } }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get(`/users/${params.id}`, {
                    headers: {
                        Authorization: `${localStorage.getItem('access_token')}`,
                    },
                });
                setUser(data.data);
                console.log(data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [params.id, user]);

    return (
        <div className="bg-[#151424] relative flex-grow min-h-screen p-0">
            <div>
                <PlayerBanner user={user} />
            </div>



            <div id="biggest wrapper" className="flex flex-col items-center justify-center">
                <div className="flex justify-center ">
                    <div className="flex justify-center flex-row flex-wrap">
                        <SkillAnalytics />
                        <ProgressBar user={user} />
                        <Performance user={user} />

                    </div>
                </div>
                <div className="flex justify-center flex-wrap">
                    <div className="w-full lg:w-2/3">
                        <MatchHistory />
                    </div>
                    <div className="w-full lg:w-1/3">
                        <FriendsList />
                    </div>
                </div>
            </div>
        </div>
    );
}