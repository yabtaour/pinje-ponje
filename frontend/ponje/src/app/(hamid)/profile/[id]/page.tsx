'use client';
import Loader from "@/app/components/loader";
import { useAppSelector } from "@/app/globalRedux/store";
import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import { useToast } from '@chakra-ui/react';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { User } from '../../../types/user';
import FriendsList from "../components/FriendsList";
import MatchHistory from "../components/MatchHistory";
import Performance from "../components/Performance";
import PlayerBanner from "../components/PlayerBanner";
import ProgressBar from "../components/ProgressBar";
import SkillAnalytics from "../components/SkillAnalytics";



export default function Profile({ params }: { params: { id: number } }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [Friends, setFriends] = useState([]);
    const router = useRouter();
    const toast = useToast();
    const newNotification = useAppSelector((state) => state.authReducer.value.newNotification);
    const dispatch = useDispatch();

    useEffect(() => {
        if (isNaN(params.id)) {
            router.push('/404');
        }
        const fetchFriends = async (userId: number) => {
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
                const friends = data.data;
                setFriends(friends);
                setLoading(false);
            } catch (err) {
                toast({
                    title: 'Error',
                    description: "error while getting friends",
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



        const fetchData = async () => {
            try {

                const token = getToken();

                if (!token) {
                    console.error('Access token not found in Cookies');
                    return;
                }
                const data = await axios.get(`/users/${params.id}`, {
                    headers: {
                        Authorization: getToken(),
                    },
                });
                setUser(() => data.data);

                fetchFriends(data.data.id);
                setLoading(false);
            } catch (Error: any) {
                if (Error.isAxiosError && Error.response && Error.response.status === 404) {
                    router.push('/404');
                } else {
                    toast({
                        title: 'Error',
                        status: 'error',
                        duration: 9000,
                        isClosable: true,
                        position: "bottom-right",
                        variant: "solid",
                    });
                }
                console.error(Error);
                setLoading(false);
            }
        };
        fetchData();
    }, [params.id, dispatch, newNotification]);



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