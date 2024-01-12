'use client';
import Loader from "@/app/components/loader";
import { fetchUserData, getToken, setSession } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAppSelector } from '../../globalRedux/store';
import { User } from '../../types/user';
import FriendsList from "./components/FriendsList";
import MatchHistory from "./components/MatchHistory";
import Performance from "./components/Performance";
import PlayerBanner from "./components/PlayerBanner";
import ProgressBar from "./components/ProgressBar";
import SkillAnalytics from "./components/SkillAnalytics";
import { getCookie } from "cookies-next";
import { useDispatch } from "react-redux";
import { login } from "@/app/globalRedux/features/authSlice";



export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [Friends, setFriends] = useState([]);
    const router = useRouter();
    const toast = useToast();
    const newNotification = useAppSelector((state) => state?.authReducer?.value?.newNotification);
    const dispatch = useDispatch();


    useEffect(() => {

        let accessToken = getCookie('token');
    
        const tokenVerification = async (token?: string | null | undefined) => {
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/users/verify-token`, {}, {
            headers: {
              Authorization: `${token}`,
            },
          })
            .then(() => {
              if (accessToken) {
                fetchUserData(accessToken).then((data) => {
                  dispatch(login({ user: data, token: accessToken }));
                  setSession(accessToken);
                  if (data?.twoFactor && !localStorage.getItem('2fa'))
                    router.push('/verification');
                  if (!data?.profile?.avatar)
                    router.push('/onboarding');
                })
              }
              router.push('/profile');
            })
            .catch(() => {
                toast({
                    title: 'Error',
                    description: `Token Verification Error`,
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                })
            });
        };
    
        tokenVerification(accessToken);
      }, [])


    useEffect(() => {
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
                    duration: 3000,
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
                const data = await axios.get(`/users/me`, {
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
                        duration: 3000,
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
    }, [ newNotification]);



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

