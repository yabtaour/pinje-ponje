'use client';
import Loader from "@/app/components/loader";
import { fetchUserData, getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FriendsList from "./components/FriendsList";
import MatchHistory from "./components/MatchHistory";
import Performance from "./components/Performance";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import SkillAnalytics from "./components/SkillAnalytics";
import { useAppSelector } from '@/app/globalRedux/store';



export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [Friends, setFriends] = useState([]);
    const router = useRouter();
    const toast = useToast();

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
                const userId = data.data.id;
                fetchFriends(userId);
                setUser(data.data);
                setLoading(false);
                if (data?.data?.twoFactor && !localStorage.getItem('2fa'))
                    router.push('/verification');

                if (!data?.data?.profile?.avatar) 
                    router.push('/onboarding');

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchData();



    }, []);

    // const me = useAppSelector(state => state?.authReducer?.value?.user);

    const fetchFriends = async (userId: number) => {
        try {
            let me  = null;
            const token = getToken();
                if (token !== null)
                     me  = await fetchUserData(token)


            if (!token) {
                console.error('Access token not found in Cookies');
                return;
            }

            if (me)
            {
                const res = await axios.get(`/users/${me?.id}/friends`);
                const friends = res.data;
                setFriends(friends);
                setLoading(false);
                console.log(res.data);
            }
        } catch (err) {
            toast({
                title: 'Error',
                description: "error while getting friends",
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
                colorScheme: "red",
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
        <div className="bg-[#151424] relative flex-grow min-h-screen p-0">
            <div>
                <PlayerBanner user={user} />
            </div>

            <div id="biggest wrapper" className="flex flex-col items-center justify-center">
                <div className="flex-auto mb-4 md:mb-0">
                    <div className="flex flex-col md:flex-row ">
                        <SkillAnalytics user={user} />
                        <Performance user={user} />
                        <ProgressBar user={user} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4 md:mb-0">
                        <FriendsList users={Friends} />
                    </div>
                    <div>
                        <MatchHistory user={user} />
                    </div>
                </div>
            </div>
        </div>

    );
}

