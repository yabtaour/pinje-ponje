'use client'
import axios from "@/app/utils/axios";
import SocketManager from '@/app/utils/socketManager';
import Image from 'next/image';
import { useEffect, useState } from "react";
import PlayerCard, { PlayerSkeleton } from '../components/PlayerCard';
import { useRouter } from 'next/navigation';


export default function VersusScreen() {
    const [playerFound, setPlayerFound] = useState(false);
    const [enemyPlayer, setEnemyPlayer] = useState<any>(null);
    const [selectedMap, setSelectedMap] = useState('');
    const [currentUserId, setcurrentUserId] = useState(0);
    const [gameId, setGameId] = useState(0);
    const [user, setUser] = useState(null);
    const [startGame, setStartGame] = useState(false);
    const [sentInitialize, setSentInitialize] = useState(false);
    const [readyToInitialize, setReadyToInitialize] = useState(false);
    const router = useRouter();
    
    const SocketManagerGame = SocketManager.getInstance("http://localhost:3000",`${localStorage.getItem('access_token')}`);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                try {
                    const data = await axios.get(`http://localhost:3000/users/me`, {
                        headers: {
                            Authorization: `${localStorage.getItem('access_token')}`,
                        },
                    });
                    console.log(data.data);
                    setUser(data.data);
                    setcurrentUserId(data.data.id);
                } catch (err) {
                    console.error(err);
                }
            }
        };
        if (!user)
            fetchData();
    }, [user]);
    
    useEffect(() => {
        const waitForNewGame = async () => {
            console.log("enemyPlayer ", enemyPlayer );
            console.log("playerFound: ", playerFound);
            if (!gameId) {
                if (SocketManagerGame) {
                    SocketManagerGame.waitForConnection(async () => {
                        try {
                            let data = await SocketManagerGame.onNewGame();
                            if (data) {
                                setGameId(data.id);
                                const otherUser = data.players.find((player : any) => player.userId !== currentUserId);
                                setEnemyPlayer(otherUser);
                                setPlayerFound(true);
                            }
                        } catch (error) {
                            console.error("Error in onNewGame:", error);
                        }
                    });
                }
            }
        };
        if (user) {
            waitForNewGame();
        }
    }, [user, enemyPlayer]);

    // useEffect(() => {
    //     if (selectedMap) {
    //         if (SocketManagerGame) {
    //             SocketManagerGame.waitForConnection(async() => {
    //                 console.log("connected");
    //                 try {
    //                     let data = await SocketManagerGame.onStartGame();
    //                     setReadyToInitialize(true);
    //                     console.log("data:",data);
    //                     if (data)
    //                         setStartGame(true);
    //                     console.log(startGame);
    //                 } catch (error) {
    //                     console.error("Error in sendInitialize:", error);
    //                 }
    //             })
    //         }
    //     }
    // }, [readyToInitialize, startGame, sentInitialize])

    useEffect(() => {
        console.log("sentInitialize : ", sentInitialize);
        if (selectedMap && !sentInitialize) {
                if (SocketManagerGame) {
                    SocketManagerGame.waitForConnection(async() => {
                        console.log("connecteeed");
                        try {
                            await SocketManagerGame.sendIntialization({gameId: gameId, playerPos: 30, ballVel: 3});
                            setSentInitialize(true);
                        } catch (error) {
                            console.error("Error in sendInitialize:", error);
                        }
                    })
                }
        }
    }, [selectedMap, sentInitialize])
    
    const handleMapClick = (map: string) => {
        console.log("map clicked");
        setSelectedMap(() => map);
    };

    return (
        startGame ? (
            <div>KHOUYA SF TL9 LIYA DIK LGAME</div>
        ) : (
        <div className='min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321] flex flex-col justify-center items-center'>
            <div className='grid grid-cols-3'>
                <PlayerCard user={user} cardColor="#4A40BF" />
                <div className="flex items-center justify-center">
                    <svg width="208" height="189" viewBox="0 0 308 289" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M233 9L156 36.5L115.5 176L156 169L127.5 278L166.5 220.5C149 178 161 202.5 157.5 193C154.7 185.4 157.667 184 160 184L188 180.5L226.5 114L182.5 121L233 9Z" fill="#77DFF8" />
                        <path d="M231 58.5008C250.167 56.3341 291.3 63.2008 302.5 108.001L257.5 113C251 100.5 232.2 81.5 209 105.5" stroke="#4A40BF" strokeWidth="5" />
                        <path d="M232.5 128C257.5 128.333 301.289 141.003 305 188.5C310 252.5 167.5 273 156 186.5L199 182.5C205.333 194.833 221.507 213.843 244.5 205C270.5 195 260 166.5 218 165.5" stroke="#4A40BF" strokeWidth="5" />
                        <path d="M140 59.5H133L92.5 198L51 59.5H4L64 235H119.5L137.5 183.5" stroke="#4A40BF" strokeWidth="5" />
                        <path d="M87.9492 31.0117C93.5519 31.4267 96.7159 38.1084 101.725 39.7782" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M144.305 1.58203V19.7411" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M164.969 268.959C162.455 274.316 160.146 279.896 157.002 284.926C156.477 285.767 156.202 286.159 156.202 287.118" stroke="white" strokeWidth="3" strokeLinecap="round" />
                        <path d="M212.558 260.818C213.933 264.347 218.193 268.98 218.193 272.716" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                </div>
                {playerFound && enemyPlayer ? (
                    <PlayerCard user={enemyPlayer.user} cardColor="#CE4242" />
                ) : (
                    <div className="flex flex-col items-center">
                        <PlayerSkeleton />
                        <p className="text-[#77DFF8] text-sm bg-[#201e34] p-4 rounded-lg flex flex-row animate-pulse font-semibold">Looking for opponent
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" className="ml-2">
                                <path d="M11.7671 20.7563C16.7316 20.7563 20.7561 16.7318 20.7561 11.7673C20.7561 6.80283 16.7316 2.77832 11.7671 2.77832C6.80259 2.77832 2.77808 6.80283 2.77808 11.7673C2.77808 16.7318 6.80259 20.7563 11.7671 20.7563Z" stroke="#77DFF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M18.0181 18.4854L21.5421 22.0004" stroke="#77DFF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </p>
                    </div>
                )}
            </div>
            {playerFound && enemyPlayer ? (
                <div className="flex flex-col items-center justify-center mt-12 space-y-4">
                    <p className="text-[#77DFF8] text-xl rounded-lg flex flex-row font-semibold"> PICK A GAME MAP </p>
                    <div className="bg-[#201e34] p-2 rounded-lg flex flex-row space-x-4 items-center w-full mt-12 justify-center">
                        <a onClick={() => handleMapClick('map1')}
                            className={`cursor-pointer ${selectedMap === 'map1' ? 'border border-[#77DFF8]' : ''}`}>
                            <Image
                                src="/map_1.png"
                                alt="Game Map 1"
                                width={100}
                                height={100}
                                className="cursor-pointer"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </a>
                        <a onClick={() => handleMapClick('map2')}
                            className={`cursor-pointer ${selectedMap === 'map2' ? 'border border-[#77DFF8]' : ''}`}>
                            <Image
                                src="/map_2.png"
                                alt="Game Map 2"
                                width={100}
                                height={100}
                                className="cursor-pointer"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </a>
                        <a onClick={() => handleMapClick('map3')}
                            className={`cursor-pointer ${selectedMap === 'map3' ? 'border border-[#77DFF8]' : ''}`}>
                            <Image
                                src="/map_3.png"
                                alt="Game Map 3"
                                width={100}
                                height={100}
                                className="cursor-pointer"
                                style={{ width: 'auto', height: 'auto' }}
                            />
                        </a>
                    </div>
                    {/* <p className="text-white">hehe {selectedMap}</p> */}
                </div>
            ) : (
                <p></p>
            )}
        </div>
    )
    );
}
