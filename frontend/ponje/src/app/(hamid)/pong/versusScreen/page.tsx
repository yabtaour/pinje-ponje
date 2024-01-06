// 'use client'
// import { getToken } from "@/app/utils/auth";
// import axios from "@/app/utils/axios";
// import SocketManager from "@/app/utils/socketManager";
// import { useToast } from "@chakra-ui/react";
// import Matter, { Body, Events } from 'matter-js';
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from 'react';
// import PlayerCard, { PlayerSkeleton } from "../components/PlayerCard";
// import ScoreCard from "../components/ScoreCard";

// const socketManager = SocketManager.getInstance();

// export const Engine = Matter.Engine;
// export const Render = Matter.Render;
// export const World = Matter.World;
// export const Bodies = Matter.Bodies;

// let engine: Matter.Engine;
// let render: Matter.Render;
// let world: Matter.World;
// let ball: Matter.Body;
// let floor: Matter.Body;
// let ceiling: Matter.Body;
// let rightPaddle: Matter.Body;
// let leftPaddle: Matter.Body;
// let worldHeight: number;
// let worldWidth: number;
// let canvaHeight: number;
// let canvaWidth: number;

// const DEFAULT_VALUES = {
//     user: null,
//     enemyPlayer: null,
//     playerFound: false,
//     selectedMap: "",
//     gameStarted: false,
//     myScore: 0,
//     enemyScore: 0,
//     startGame: false,
//     gameId: 0,
//     // ... add other default values as needed
//   };


// const keys: any = {
//     ArrowUp: false,
//     ArrowDown: false,
// };

// let currentGameId = 0;
// let currentUserId = 0;

// let ballX = 4;
// let ballY = 4;

// let isPaddlePosSent = false;
// let isBallSent = false;
// let isScoreSent = false;


// //-----------------utils----------------//
// export function createBodies() {
//     const balldiam = Math.min(canvaWidth, canvaHeight) * 0.1;

//     ball = Bodies.circle(worldWidth / 2, worldHeight / 2, balldiam, {
//         restitution: 1,
//         frictionAir: 0,
//         friction: 0,
//         render: {
//             fillStyle: "#73ffff"
//         }
//     });

//     rightPaddle = Bodies.rectangle(worldWidth - 20, worldHeight / 2, 20, 100, {
//         isStatic: true,
//         render: {
//             fillStyle: "#4EFFF4",
//         }
//     });
//     leftPaddle = Bodies.rectangle(20, worldHeight / 2, 20, 100, {
//         isStatic: true,
//         render: {
//             fillStyle: "#4EFFF4"
//         }
//     });

//     floor = Bodies.rectangle(0, worldHeight, worldWidth * 2, 5, { isStatic: true });
//     ceiling = Bodies.rectangle(0, 0, worldWidth * 2, 5, { isStatic: true });

//     return [rightPaddle, leftPaddle, ball, floor, ceiling];
// }

// export async function updatePaddlesgame(gameId: number) {
//     if (!isPaddlePosSent && keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 10) {
//         await socketManager.sendPaddlePosition({ gameId: gameId, direction: 'up' });
//         isPaddlePosSent = true;
//     }
//     if (!isPaddlePosSent && keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < worldHeight - 10) {
//         await socketManager.sendPaddlePosition({ gameId: gameId, direction: 'down' });
//         isPaddlePosSent = true;
//     }
// }

// export async function handleColision(pair: any, bodyA: Matter.Body, bodyB: Matter.Body) {
//     if (bodyA == ball || bodyB == ball) {
//         let otherBody = bodyA === ball ? bodyB : bodyA;
//         if (otherBody === floor || otherBody === ceiling) {
//             await socketManager.sendBallUpdate({ gameId: currentGameId, position: ball.position, velocity: ball.velocity, edge: "floor", worldWidth: worldWidth })
//         }
//         else if (otherBody === leftPaddle || otherBody === rightPaddle) {
//             await socketManager.sendBallUpdate({ gameId: currentGameId, position: ball.position, velocity: ball.velocity, edge: "paddle", worldWidth: worldWidth })
//         }
//     }
// }

// export async function updateScore(gameId: number) {
//     if (!isScoreSent) {
//         await socketManager.sendScoreUpdate({gameId: gameId});
//         isScoreSent = true;
//     }
// }

// const ballReachedLeftThreshold = () => {
//     const leftThreshold = 0;
//     return ball.position.x <= leftThreshold;
// };

// const ballReachedRightThreshold = () => {
//     const leftThreshold = worldWidth;
//     return ball.position.x >= leftThreshold;
// };


// //--------------------------------------//

// export default function VersusScreen() {
//     const [user, setUser] = useState(null);
//     const [enemyPlayer, setEnemyPlayer] = useState<any>(null);
//     const [playerFound, setPlayerFound] = useState(false);
//     const [selectedMap, setSelectedMap] = useState("");
//     const [gameStarted, setGameStarted] = useState(false);
//     const [myScore, setMyScore] = useState(0);
//     const [enemyScore, setEnemyScore] = useState(0);
//     const [startGame, setStartGame] = useState(false);
//     const [gameId, setGameId] = useState(0);

//     const boxRef = useRef<HTMLDivElement>(null);
//     const canvasRef = useRef<HTMLCanvasElement>(null);

//     const toast = useToast();
//     const router = useRouter();

//     useEffect(() => {
//         const fetchUserData = async () => {
//             try {
//                 console.log("FETCHED USER");
//                 const token = getToken();
//                 if (!token) {
//                     console.error('Access token not found in Cookies');
//                     return;
//                 }
//                 const data = await axios.get(`/users/me`, {
//                     headers: {
//                         Authorization: token,
//                     },
//                 });
//                 setUser(data.data);
//                 currentUserId = data.data.id;
//             } catch (err) {
//                 toast({
//                     title: 'Error',
//                     description: "error while gettinge friends",
//                     status: 'error',
//                     duration: 9000,
//                     isClosable: true,
//                     position: "bottom-right",
//                     variant: "solid",
//                     colorScheme: "red",
//                 });
//                 console.error("Error in fetchData:", err);
//             }           
//         }
//         if (!user)
//             fetchUserData();
//     }, [user]);

//     useEffect(() => {
//         const startGameFoundListener = async () =>  {
//             console.log("SETUP GAME FOUND LISTENER");
//             if (socketManager) {
//                 socketManager.waitForConnection(async () => {
//                     try {
//                         socketManager.onNewGame((data) => {
//                             const {game, id} = data;
//                             if (game) {
//                                 setGameId(game.id);
//                                 currentGameId = game.id;
//                                 setEnemyPlayer(
//                                     game.players.find((player: any) => player.userId !== currentUserId)
//                                 );
//                                 setPlayerFound(true);
//                             }
//                         })
//                     } catch (error) {
//                         toast({
//                             title: 'Error',
//                             description: "Error in on NewGame",
//                             status: 'error',
//                             duration: 9000,
//                             isClosable: true,
//                             position: "bottom-right",
//                             variant: "solid",
//                             colorScheme: "red",
//                         });
//                         console.error("Error in onNewGame:", error);                        
//                     }
//                 })
//             }
//         }
//         if (!enemyPlayer && !playerFound)
//             startGameFoundListener();
//     }, [enemyPlayer, playerFound])

//     useEffect(() => {
//         const startGameListener = async() => {
//             console.log("SETUP START GAME LISTENER");
//             if (socketManager) {
//                 socketManager.waitForConnection(async () => {
//                     socketManager.onStartGame(async (data) => {
//                         if (data) {
//                             if (data.reversed == true) {
//                                 ballX *= -1;
//                             }
//                             setGameStarted(true);
//                             setStartGame(true);
//                         }
//                     })
//                 });
//             }
//         }
//         if (!gameStarted)
//             startGameListener();
//     }, [gameStarted])

//     useEffect(() => {
//         const sendGameInitialize = async () => {
//             console.log("SETUP INITIALIZE SENT");
//             if (socketManager) {
//                 socketManager.waitForConnection(async () => {
//                     try {
//                         await socketManager.sendIntialization({gameId: gameId, playerPos: 30, ballVel: 3});
//                     } catch (error) {
//                         console.log("Error in send intitialization ", error);
//                     }
//                 })
//             }
//         }
//         if (selectedMap && !gameStarted && gameId)
//             sendGameInitialize();
//     }, [selectedMap, gameId])

//     useEffect(() => {
//         console.log("SETUP PADDLE UPDATE LISTENER");
//         if (socketManager) {
//             socketManager.waitForConnection(async () => {
//                 socketManager.onPaddlePosition((data) => {
//                     const {playerId, direction} = data;
//                     if (playerId == currentUserId) {
//                         if (direction == "up") {
//                             Body.translate(leftPaddle, { x: 0, y: -4 });
//                         } else {
//                             Body.translate(leftPaddle, { x: 0, y: 4 });
//                         }                        
//                     } else {
//                         if (direction == "up") {
//                             Body.translate(rightPaddle, { x: 0, y: -4 });
//                         } else {
//                             Body.translate(rightPaddle, { x: 0, y: 4 });
//                         }                        
//                     }
//                     isPaddlePosSent = false;
//                 })
//             })
//         }
//     }, [])

//     useEffect(() => {
//         console.log("SETUP BALL UPDATE LISTENER");
//         if (socketManager) {
//             socketManager.waitForConnection(async () => {
//                 socketManager.onBallUpdate((data) => {
//                     const {position, velocity} = data;
//                     Body.setPosition(ball, position);
//                     Body.setVelocity(ball, velocity);
//                     isBallSent = false;
//                 })
//             })
//         }
//     }, [])

//     useEffect(() => {
//         console.log("SETUP SCORE UPDATE LISTENER")
//         if (socketManager) {
//             socketManager.waitForConnection(async() => {
//                 socketManager.onScoreUpdate((data) => {
//                     const {player, newScore} = data;
//                     Body.setVelocity(ball, {
//                         x: ballX,
//                         y: ballY,
//                     });
//                     Body.setPosition(ball, { x: worldWidth / 2, y: worldHeight / 2 });
//                     Body.setPosition(leftPaddle, { x: 20, y: worldHeight / 2 });
//                     Body.setPosition(rightPaddle, { x: worldWidth - 20, y: worldHeight / 2 });
//                     Body.setPosition(floor, { x: 0, y: worldHeight });
//                     Body.setPosition(ceiling, { x: 0, y: 0 });
//                     if (player == currentUserId) {
//                         setEnemyScore(newScore);
//                     }
//                     else {
//                         setMyScore(newScore);
//                     }
//                     isScoreSent = false;
//                 })
//             })
//         }
//     }, [])

//     useEffect(() => {
//         const createGame = async () => {
//             try {
//                 worldWidth = canvasRef.current?.width! * 4;
//                 worldHeight = canvasRef.current?.height! * 4;
//                 canvaWidth = canvasRef.current?.width!;
//                 canvaHeight = canvasRef.current?.height!;

//                 console.log(worldHeight, worldWidth, canvaHeight, canvaWidth)

//                 engine = Engine.create({
//                     gravity: {
//                         x: 0,
//                         y: 0,
//                     }
//                 });
//                 render = Render.create({
//                     element: boxRef.current!,
//                     canvas: canvasRef.current!,
//                     engine: engine,
//                     options: {
//                         width: worldWidth,
//                         height: worldHeight,
//                         wireframes: true,
//                         background: 'transparent',
//                     },
//                 });
//                 createBodies();
//                 Body.setVelocity(ball, {
//                     x: ballX,
//                     y: ballY,
//                 });
//                 World.add(engine.world, [ball, leftPaddle, rightPaddle, ceiling, floor]);
//                 console.log(ball, leftPaddle, rightPaddle);
//                 Render.run(render);
//                 Matter.Runner.run(engine);

//                 const colisionHandler = (event: any) => {
//                     event.pairs.forEach((pair: any) => {
//                         const { bodyA, bodyB } = pair;
//                         handleColision(pair, bodyA, bodyB)
//                     });
//                 }
//                 Events.on(engine, 'collisionStart', colisionHandler);

//             const beforeUpdateHnadler = () => {
//                 let intervalId: NodeJS.Timeout | null = null;
//                 if (intervalId) {
//                     clearInterval(intervalId);
//                 }
//                 if (ballReachedLeftThreshold()) {
//                     console.log("mchat mn lisr !! ")
//                     Body.setPosition(ball, { x: worldWidth / 2, y: worldHeight / 2 });
//                     Body.setPosition(leftPaddle, { x: 20, y: worldHeight / 2 });
//                     Body.setPosition(rightPaddle, { x: worldWidth - 20, y: worldHeight / 2 });
//                     Body.setPosition(floor, { x: 0, y: worldHeight });
//                     Body.setPosition(ceiling, { x: 0, y: 0 });
//                     Body.setVelocity(ball, {
//                         x: 0,
//                         y: 0
//                     })
//                     Body.setPosition(floor, { x: 0, y: worldHeight });
//                     Body.setPosition(ceiling, { x: 0, y: 0 });
//                     updateScore(gameId);
//                 }
//                     if (ballX > 0) {
//                         intervalId = setInterval(() => {
//                             socketManager.sendTestingSendBallUpdate({
//                                 gameId: gameId,
//                                 position: ball.position,
//                                 velocity: ball.velocity,
//                                 edge: "paddle",
//                                 worldWidth: worldWidth
//                             });
//                         }, 1000);
//                     }
//                     updatePaddlesgame(gameId);
//             }
//             Events.on(engine, 'beforeUpdate', beforeUpdateHnadler);

//             } catch (error) {
//                 console.error("Error creating game", error);
//             }
//         }
//         if (gameStarted)
//             createGame();
//     }, [gameStarted, myScore, enemyScore])

//     useEffect(() => {
//         const handleGameEnd = () => {
//             console.log("SETUP GAME END LISTSNER");
//             if (socketManager) {
//                 socketManager.waitForConnection(async() => {
//                     socketManager.onGameFinished((data) => {
//                         setUser(DEFAULT_VALUES.user);
//                         setEnemyPlayer(DEFAULT_VALUES.enemyPlayer);
//                         setPlayerFound(DEFAULT_VALUES.playerFound);
//                         setSelectedMap(DEFAULT_VALUES.selectedMap);
//                         setGameStarted(DEFAULT_VALUES.gameStarted);
//                         setMyScore(DEFAULT_VALUES.myScore);
//                         setEnemyScore(DEFAULT_VALUES.enemyScore);
//                         setStartGame(DEFAULT_VALUES.startGame);
//                         setGameId(DEFAULT_VALUES.gameId);
//                         router.push('/pong');
//                     })
//                 })
//             }
//         }
//         handleGameEnd();
//     }, [])

//     useEffect(() => {
//         console.log("SETUP NEW KEYS HANDLERS");
//         const handleKeyUp = (event: any) => {
//             if (keys.hasOwnProperty(event.code)) {
//                 event.preventDefault();
//                 keys[event.code] = true;
//             }
//         }
//         window.addEventListener('keydown', handleKeyUp);

//         const handleKeyDown = (event: any) => {
//             if (keys.hasOwnProperty(event.code)) {
//                 event.preventDefault();
//                 keys[event.code] = false;
//             }
//         }
//         window.addEventListener('keyup', handleKeyDown);

//         return () => {
//             console.log("KEYS HANDLERS");
//             window.removeEventListener('keydown', handleKeyDown);
//             window.removeEventListener('keyup', handleKeyUp);
//           };
//     }, [])

//     const handleMapClick = (map: string) => {
//         console.log("MAP CLICKED : ", map, selectedMap);
//         if (!selectedMap && map) {
//             setSelectedMap(map);
//         }
//     };

//     return (
//             startGame ? (
//                 <div className='w-full h-screen flex flex-col items-center justify-center'>
//                     <div className="p-4 text-white">
//                         <ScoreCard playerOne={user} playerTwo={enemyPlayer} myScore={myScore} enemyScore={enemyScore} />
//                     </div>
//                     <div className='aspect-w-2 aspect-h-3 md:aspect-w-16 md:aspect-h-9 border-2 border-black z-30' ref={boxRef} style={{
//                         backgroundImage: `url(${selectedMap})`,
//                         backgroundSize: "100% 100%",
//                         backgroundRepeat: "no-repeat",
//                         border: "solid 1px red",
//                         backgroundPosition: "center",

//                         position: "relative"
//                     }}>
//                         <canvas className='w-full h-full border-2 border-black z-30' id="myCanva" ref={canvasRef} />
//                     </div>


//                 </div>
//             ) : (
//                 <div className='min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321] flex flex-col justify-center items-center'>
//                     <div className='grid grid-cols-3'>
//                         <PlayerCard user={user} cardColor="#4A40BF" />
//                         <div className="flex items-center justify-center">
//                             <svg width="208" height="189" viewBox="0 0 308 289" fill="none" xmlns="http://www.w3.org/2000/svg">
//                                 <path d="M233 9L156 36.5L115.5 176L156 169L127.5 278L166.5 220.5C149 178 161 202.5 157.5 193C154.7 185.4 157.667 184 160 184L188 180.5L226.5 114L182.5 121L233 9Z" fill="#77DFF8" />
//                                 <path d="M231 58.5008C250.167 56.3341 291.3 63.2008 302.5 108.001L257.5 113C251 100.5 232.2 81.5 209 105.5" stroke="#4A40BF" strokeWidth="5" />
//                                 <path d="M232.5 128C257.5 128.333 301.289 141.003 305 188.5C310 252.5 167.5 273 156 186.5L199 182.5C205.333 194.833 221.507 213.843 244.5 205C270.5 195 260 166.5 218 165.5" stroke="#4A40BF" strokeWidth="5" />
//                                 <path d="M140 59.5H133L92.5 198L51 59.5H4L64 235H119.5L137.5 183.5" stroke="#4A40BF" strokeWidth="5" />
//                                 <path d="M87.9492 31.0117C93.5519 31.4267 96.7159 38.1084 101.725 39.7782" stroke="white" strokeWidth="3" strokeLinecap="round" />
//                                 <path d="M144.305 1.58203V19.7411" stroke="white" strokeWidth="3" strokeLinecap="round" />
//                                 <path d="M164.969 268.959C162.455 274.316 160.146 279.896 157.002 284.926C156.477 285.767 156.202 286.159 156.202 287.118" stroke="white" strokeWidth="3" strokeLinecap="round" />
//                                 <path d="M212.558 260.818C213.933 264.347 218.193 268.98 218.193 272.716" stroke="white" strokeWidth="3" strokeLinecap="round" />
//                             </svg>
//                         </div>
//                         {playerFound && enemyPlayer ? (
//                             <PlayerCard user={enemyPlayer.user} cardColor="#CE4242" />
//                         ) : (
//                             <div className="flex flex-col items-center">
//                                 <PlayerSkeleton />
//                                 <p className="text-[#77DFF8] text-sm bg-[#201e34] p-4 rounded-lg flex flex-row animate-pulse font-semibold">Looking for opponent
//                                     <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" className="ml-2">
//                                         <path d="M11.7671 20.7563C16.7316 20.7563 20.7561 16.7318 20.7561 11.7673C20.7561 6.80283 16.7316 2.77832 11.7671 2.77832C6.80259 2.77832 2.77808 6.80283 2.77808 11.7673C2.77808 16.7318 6.80259 20.7563 11.7671 20.7563Z" stroke="#77DFF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                         <path d="M18.0181 18.4854L21.5421 22.0004" stroke="#77DFF8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
//                                     </svg>
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                     {playerFound && enemyPlayer ? (
//                         <div className="flex flex-col items-center justify-center mt-12 space-y-4">
//                             <p className="text-[#77DFF8] text-xl rounded-lg flex flex-row font-semibold"> PICK A GAME MAP </p>
//                             <div className="bg-[#201e34] p-2 rounded-lg flex flex-row space-x-4 items-center w-full mt-12 justify-center">
//                                 <a onClick={() => handleMapClick('/map1.png')}
//                                     className={`cursor-pointer ${selectedMap === '/map1.png' ? 'border border-[#77DFF8]' : ''}`}>
//                                     <Image
//                                         src="/map_1.png"
//                                         alt="Game Map 1"
//                                         width={100}
//                                         height={100}
//                                         className="cursor-pointer"
//                                         style={{ width: 'auto', height: 'auto' }}
//                                     />
//                                 </a>
//                                 <a onClick={() => handleMapClick('/map2.png')}
//                                     className={`cursor-pointer ${selectedMap === '/map2.png' ? 'border border-[#77DFF8]' : ''}`}>
//                                     <Image
//                                         src="/map_2.png"
//                                         alt="Game Map 2"
//                                         width={100}
//                                         height={100}
//                                         className="cursor-pointer"
//                                         style={{ width: 'auto', height: 'auto' }}
//                                     />
//                                 </a>
//                                 <a onClick={() => handleMapClick('/map3.png')}
//                                     className={`cursor-pointer ${selectedMap === '/map3.png' ? 'border border-[#77DFF8]' : ''}`}>
//                                     <Image
//                                         src="/map_3.png"
//                                         alt="Game Map 3"
//                                         width={100}
//                                         height={100}
//                                         className="cursor-pointer"
//                                         style={{ width: 'auto', height: 'auto' }}
//                                     />
//                                 </a>
//                             </div>
//                         </div>
//                     ) : (
//                         <div>
//                             <button className="btn  lg:h-12 bg-red-500 mt-10 mb-10 text-xs lg:text-sm">
//                                 Cancel matchmaking
//                                 <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="ml-2 w-4 h-4 md:w-8 md:h-8 hidden lg:block">
//                                     <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.55 2 2.5 8.05 2.5 15.5C2.5 22.95 8.55 29 16 29C16.53 29 17.051 28.962 17.566 28.902L17.582 28.918L17.6 28.898C24.296 28.105 29.5 22.408 29.5 15.5C29.5 8.593 24.296 2.9 17.602 2.105C17.585 2.091 17.57 2.075 17.552 2.061V2.055L17.522 2.092C17.021 2.035 16.514 2 16 2ZM15.5 3.025V8H11.16C12.077 6.057 13.334 4.372 14.836 3.059C15.055 3.039 15.278 3.034 15.5 3.025ZM16.5 3.025C16.723 3.035 16.947 3.038 17.166 3.059C18.671 4.372 19.931 6.054 20.85 8H16.5V3.025ZM13.076 3.357C11.8117 4.72297 10.7873 6.29273 10.046 8H6.015C7.75713 5.67785 10.2535 4.03592 13.076 3.357ZM18.922 3.357C21.7453 4.03541 24.2434 5.67741 25.986 8H21.96C21.2167 6.29216 20.1889 4.72235 18.922 3.357ZM5.336 9H9.646C8.94326 10.9247 8.56086 12.9516 8.514 15H3.525C3.60535 12.8781 4.22953 10.8123 5.336 9ZM10.738 9H15.5V15H9.514C9.56888 12.9439 9.98313 10.9133 10.738 9ZM16.5 9H21.27C22.025 10.9133 22.4392 12.9439 22.494 15H16.5V9ZM22.36 9H26.664C27.7705 10.8123 28.3937 12.8781 28.474 15H23.494C23.4462 12.9514 23.0628 10.9245 22.359 9H22.36ZM3.524 16H8.513C8.55979 18.0484 8.94219 20.0753 9.645 22H5.334C4.22809 20.1875 3.60527 18.1217 3.525 16H3.524ZM9.513 16H15.5V22H10.738C9.98315 20.0867 9.5689 18.0561 9.514 16H9.513ZM16.499 16H22.468C22.362 17.883 21.848 19.953 20.95 22H16.5L16.499 16ZM23.469 16H28.474C28.3937 18.1217 27.7709 20.1875 26.665 22H22.036C22.879 19.97 23.371 17.916 23.469 16ZM6.015 23H10.048C10.7893 24.7073 11.8137 26.277 13.078 27.643C10.2543 26.965 7.75565 25.323 6.013 23H6.015ZM11.161 23H15.501V27.975C15.28 27.965 15.057 27.961 14.839 27.941C13.335 26.628 12.079 24.945 11.161 23ZM16.501 23H20.464C19.5719 24.7929 18.4406 26.4564 17.101 27.945C16.903 27.963 16.701 27.967 16.501 27.975V23ZM21.589 23H25.987C24.1797 25.4155 21.5581 27.0942 18.608 27.725C19.7872 26.2754 20.7874 24.6889 21.587 23H21.589Z" fill="white" />
//                                     <circle cx="23" cy="11" r="2" fill="#77DFF8" />
//                                     <circle cx="9" cy="17" r="2" fill="#77DFF8" />
//                                     <circle cx="23" cy="23" r="2" fill="#77DFF8" />
//                                 </svg>
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )
//         )   
// }





'use client'
import { getToken } from "@/app/utils/auth";
import axios from "@/app/utils/axios";
import SocketManager from "@/app/utils/socketManager";
import { useToast } from "@chakra-ui/react";
import Matter, { Body, Events } from 'matter-js';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react';
import PlayerCard, { PlayerSkeleton } from "../components/PlayerCard";
import ScoreCard from "../components/ScoreCard";

const socketManager = SocketManager.getInstance();

export const Engine = Matter.Engine;
export const Render = Matter.Render;
export const World = Matter.World;
export const Bodies = Matter.Bodies;

let engine: Matter.Engine;
let render: Matter.Render;
let world: Matter.World;
let ball: Matter.Body;
let floor: Matter.Body;
let ceiling: Matter.Body;
let rightPaddle: Matter.Body;
let leftPaddle: Matter.Body;
let worldHeight: number;
let worldWidth: number;
let canvaHeight: number;
let canvaWidth: number;

let handleKeyUp: any;
let handleKeyDown: any;
let beforeUpdateHnadler: any;
let colisionHandler: any;
let handleBeforeUnload: any;

let intervalId: NodeJS.Timeout | null = null;

const DEFAULT_VALUES = {
    user: null,
    enemyPlayer: null,
    playerFound: false,
    selectedMap: "",
    gameStarted: false,
    myScore: 0,
    enemyScore: 0,
    startGame: false,
    gameId: 0,
};


const keys: any = {
    ArrowUp: false,
    ArrowDown: false,
};

let currentGameId = 0;
let currentUserId = 0;

let ballX = 4;
let ballY = 4;

let isPaddlePosSent = false;
let isBallSent = false;
let isScoreSent = false;


//-----------------utils----------------//
export function createBodies() {
    const balldiam = Math.min(canvaWidth, canvaHeight) * 0.1;

    ball = Bodies.circle(worldWidth / 2, worldHeight / 2, balldiam, {
        restitution: 1,
        frictionAir: 0,
        friction: 0,
        render: {
            fillStyle: "#73ffff"
        }
    });

    rightPaddle = Bodies.rectangle(worldWidth - 20, worldHeight / 2, 20, 100, {
        isStatic: true,
        render: {
            fillStyle: "#4EFFF4",
        }
    });
    leftPaddle = Bodies.rectangle(20, worldHeight / 2, 20, 100, {
        isStatic: true,
        render: {
            fillStyle: "#4EFFF4"
        }
    });

    floor = Bodies.rectangle(0, worldHeight, worldWidth * 2, 5, { isStatic: true });
    ceiling = Bodies.rectangle(0, 0, worldWidth * 2, 5, { isStatic: true });

    return [rightPaddle, leftPaddle, ball, floor, ceiling];
}

export async function updatePaddlesgame(gameId: number) {
    if (!isPaddlePosSent && keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 10) {
        await socketManager.sendPaddlePosition({ gameId: gameId, direction: 'up' });
        isPaddlePosSent = true;
    }
    if (!isPaddlePosSent && keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < worldHeight - 10) {
        await socketManager.sendPaddlePosition({ gameId: gameId, direction: 'down' });
        isPaddlePosSent = true;
    }
}

export async function handleColision(pair: any, bodyA: Matter.Body, bodyB: Matter.Body) {
    if (bodyA == ball || bodyB == ball) {
        let otherBody = bodyA === ball ? bodyB : bodyA;
        if (otherBody === floor || otherBody === ceiling) {
            await socketManager.sendBallUpdate({ gameId: currentGameId, position: ball.position, velocity: ball.velocity, edge: "floor", worldWidth: worldWidth })
        }
        else if (otherBody === leftPaddle || otherBody === rightPaddle) {
            await socketManager.sendBallUpdate({ gameId: currentGameId, position: ball.position, velocity: ball.velocity, edge: "paddle", worldWidth: worldWidth })
        }
    }
}

export async function updateScore(gameId: number) {
    if (!isScoreSent) {
        await socketManager.sendScoreUpdate({ gameId: gameId });
        isScoreSent = true;
    }
}

const ballReachedLeftThreshold = () => {
    const leftThreshold = 0;
    return ball.position.x <= leftThreshold;
};

const ballReachedRightThreshold = () => {
    const leftThreshold = worldWidth;
    return ball.position.x >= leftThreshold;
};


//--------------------------------------//

export default function VersusScreen() {
    const [user, setUser] = useState(null);
    const [enemyPlayer, setEnemyPlayer] = useState<any>(null);
    const [playerFound, setPlayerFound] = useState(false);
    const [selectedMap, setSelectedMap] = useState("");
    const [gameStarted, setGameStarted] = useState(false);
    const [myScore, setMyScore] = useState(0);
    const [enemyScore, setEnemyScore] = useState(0);
    const [startGame, setStartGame] = useState(false);
    const [gameId, setGameId] = useState(0);

    const boxRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const toast = useToast();
    const router = useRouter();


    const handleCancel = async () => {
        const token = getToken();
        if (token) {
            axios.patch("/users", { status: 'ONLINE' }, {
                headers: {
                    Authorization: token,
                },
            }).then((res) => {
                // setEnemyPlayer(DEFAULT_VALUES.enemyPlayer);
                // setPlayerFound(DEFAULT_VALUES.playerFound);
                // setSelectedMap(DEFAULT_VALUES.selectedMap);
                // setGameStarted(DEFAULT_VALUES.gameStarted);
                // setMyScore(DEFAULT_VALUES.myScore);
                // setEnemyScore(DEFAULT_VALUES.enemyScore);
                // setStartGame(DEFAULT_VALUES.startGame);
                // setGameId(DEFAULT_VALUES.gameId);
                // currentGameId = 0;
                // currentUserId = 0;
                // ballX = 4;
                // ballY = 4;
                // isPaddlePosSent = false;
                // isBallSent = false;
                // isScoreSent = false;
                // window.removeEventListener('keydown', handleKeyDown);
                // window.removeEventListener('keyup', handleKeyUp);
                // window.removeEventListener('unload', handleBeforeUnload);
                // Events.off(engine, 'beforeUpdate', beforeUpdateHnadler);
                // Events.off(engine, 'collisionStart', colisionHandler);
                // setUser(DEFAULT_VALUES.user);
                // router.push('/profile');
                router.push('/pong');
            }).catch((err) => {
                toast({
                    title: 'Error',
                    description: "error in cancel",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
            });
        }
    }


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("FETCHED USER");
                const token = getToken();
                if (!token) {
                    console.error('Access token not found in Cookies');
                    return;
                }
                const data = await axios.get(`/users/me`, {
                    headers: {
                        Authorization: token,
                    },
                });
                setUser(data.data);
                currentUserId = data.data.id;
            } catch (err) {
                toast({
                    title: 'Error',
                    description: "error while gettinge friends",
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
                console.error("Error in fetchData:", err);
            }
        }
        if (!user)
            fetchUserData();
    }, [user]);

    useEffect(() => {
        const startGameFoundListener = async () => {
            console.log("SETUP GAME FOUND LISTENER");
            if (socketManager) {
                socketManager.waitForConnection(async () => {
                    try {
                        socketManager.onNewGame((data) => {
                            const { game, id } = data;
                            if (game) {
                                setGameId(game.id);
                                currentGameId = game.id;
                                setEnemyPlayer(
                                    game.players.find((player: any) => player.userId !== currentUserId)
                                );
                                setPlayerFound(true);
                            }
                        })
                    } catch (error) {
                        toast({
                            title: 'Error',
                            description: "Error in on NewGame",
                            status: 'error',
                            duration: 9000,
                            isClosable: true,
                            position: "bottom-right",
                            variant: "solid",
                            colorScheme: "red",
                        });
                        console.error("Error in onNewGame:", error);
                    }
                })
            }
        }
        if (!enemyPlayer && !playerFound)
            startGameFoundListener();
    }, [enemyPlayer, playerFound])

    useEffect(() => {
        const startGameListener = async () => {
            console.log("SETUP START GAME LISTENER");
            if (socketManager) {
                socketManager.waitForConnection(async () => {
                    socketManager.onStartGame(async (data) => {
                        if (data) {
                            if (data.reversed == true) {
                                ballX *= -1;
                            }
                            setGameStarted(true);
                            setStartGame(true);
                        }
                    })
                });
            }
        }
        if (!gameStarted && !startGame)
            startGameListener();
    }, [gameStarted, startGame])

    useEffect(() => {
        const sendGameInitialize = async () => {
            console.log("SETUP INITIALIZE SENT");
            if (socketManager) {
                socketManager.waitForConnection(async () => {
                    try {
                        await socketManager.sendIntialization({ gameId: gameId, playerPos: 30, ballVel: 3 });
                    } catch (error) {
                        console.log("Error in send intitialization ", error);
                    }
                })
            }
        }
        if (selectedMap && !gameStarted && gameId && !startGame)
            sendGameInitialize();
    }, [selectedMap])

    useEffect(() => {
        console.log("SETUP PADDLE UPDATE LISTENER");
        if (socketManager) {
            socketManager.waitForConnection(async () => {
                socketManager.onPaddlePosition((data) => {
                    const { playerId, direction } = data;
                    if (playerId == currentUserId) {
                        if (direction == "up") {
                            Body.translate(leftPaddle, { x: 0, y: -4 });
                        } else {
                            Body.translate(leftPaddle, { x: 0, y: 4 });
                        }
                    } else {
                        if (direction == "up") {
                            Body.translate(rightPaddle, { x: 0, y: -4 });
                        } else {
                            Body.translate(rightPaddle, { x: 0, y: 4 });
                        }
                    }
                    isPaddlePosSent = false;
                })
            })
        }

        return () => {

        }
    }, [])

    useEffect(() => {
        console.log("SETUP BALL UPDATE LISTENER");
        if (socketManager) {
            socketManager.waitForConnection(async () => {
                socketManager.onBallUpdate((data) => {
                    const { position, velocity } = data;
                    Body.setPosition(ball, position);
                    Body.setVelocity(ball, velocity);
                    isBallSent = false;
                })
            })
        }
    }, [])

    useEffect(() => {
        console.log("SETUP SCORE UPDATE LISTENER")
        if (socketManager) {
            socketManager.waitForConnection(async () => {
                socketManager.onScoreUpdate((data) => {
                    const { player, newScore } = data;
                    Body.setVelocity(ball, {
                        x: ballX,
                        y: ballY,
                    });
                    Body.setPosition(ball, { x: worldWidth / 2, y: worldHeight / 2 });
                    Body.setPosition(leftPaddle, { x: 20, y: worldHeight / 2 });
                    Body.setPosition(rightPaddle, { x: worldWidth - 20, y: worldHeight / 2 });
                    Body.setPosition(floor, { x: 0, y: worldHeight });
                    Body.setPosition(ceiling, { x: 0, y: 0 });
                    // window.removeEventListener('keydown', handleKeyDown);
                    // window.removeEventListener('keyup', handleKeyUp);
                    // Events.off(engine, 'beforeUpdate', beforeUpdateHnadler);
                    // Events.off(engine, 'collisionStart', colisionHandler);

                    // window.addEventListener('keydown', handleKeyDown);
                    // window.addEventListener('keyup', handleKeyUp);
                    // Events.on(engine, 'beforeUpdate', beforeUpdateHnadler);
                    // Events.on(engine, 'collisionStart', colisionHandler);
                    if (player == currentUserId) {
                        setEnemyScore(newScore);
                    }
                    else {
                        setMyScore(newScore);
                    }
                    isScoreSent = false;
                })
            })
        }
    }, [])

    useEffect(() => {
        const createGame = async () => {
            try {
                worldWidth = canvasRef.current?.width! * 4;
                worldHeight = canvasRef.current?.height! * 4;
                canvaWidth = canvasRef.current?.width!;
                canvaHeight = canvasRef.current?.height!;

                console.log(worldHeight, worldWidth, canvaHeight, canvaWidth)

                engine = Engine.create({
                    gravity: {
                        x: 0,
                        y: 0,
                    }
                });
                render = Render.create({
                    element: boxRef.current!,
                    canvas: canvasRef.current!,
                    engine: engine,
                    options: {
                        width: worldWidth,
                        height: worldHeight,
                        wireframes: true,
                        background: 'transparent',
                    },
                });
                createBodies();
                Body.setVelocity(ball, {
                    x: ballX,
                    y: ballY,
                });
                World.add(engine.world, [ball, leftPaddle, rightPaddle, ceiling, floor]);
                console.log(ball, leftPaddle, rightPaddle);
                Render.run(render);
                Matter.Runner.run(engine);

                colisionHandler = (event: any) => {
                    event.pairs.forEach((pair: any) => {
                        const { bodyA, bodyB } = pair;
                        handleColision(pair, bodyA, bodyB)
                    });
                }
                Events.on(engine, 'collisionStart', colisionHandler);

                beforeUpdateHnadler = () => {
                    if (ballReachedLeftThreshold()) {
                        console.log("mchat mn lisr !! ")
                        Body.setPosition(ball, { x: worldWidth / 2, y: worldHeight / 2 });
                        Body.setPosition(leftPaddle, { x: 20, y: worldHeight / 2 });
                        Body.setPosition(rightPaddle, { x: worldWidth - 20, y: worldHeight / 2 });
                        Body.setPosition(floor, { x: 0, y: worldHeight });
                        Body.setPosition(ceiling, { x: 0, y: 0 });
                        Body.setVelocity(ball, {
                            x: 0,
                            y: 0
                        })
                        Body.setPosition(floor, { x: 0, y: worldHeight });
                        Body.setPosition(ceiling, { x: 0, y: 0 });
                        updateScore(gameId);
                    } else if (ballReachedRightThreshold()) {
                        Body.setPosition(ball, { x: worldWidth, y: ball.position.y });
                        Body.setPosition(floor, { x: 0, y: worldHeight });
                        Body.setPosition(ceiling, { x: 0, y: 0 });
                        socketManager.sendTestingSendBallUpdate({
                            gameId: gameId,
                            position: { x: worldWidth, y: ball.position.y },
                            velocity: ball.velocity,
                            edge: "paddle",
                            worldWidth: worldWidth
                        });
                        // Body.setPosition(ball, { x: , y: ball.position.y });
                        // Body.setPosition(ball, { x: worldWidth / 2, y: worldHeight / 2 });
                        // Body.setPosition(leftPaddle, { x: 20, y: worldHeight / 2 });
                        // Body.setPosition(rightPaddle, { x: worldWidth - 20, y: worldHeight / 2 });
                        // Body.setPosition(floor, { x: 0, y: worldHeight });
                        // Body.setPosition(ceiling, { x: 0, y: 0 });
                        // Body.setVelocity(ball, {
                        //     x: 0,
                        //     y: 0
                        // })
                        // Body.setPosition(floor, { x: 0, y: worldHeight });
                        // Body.setPosition(ceiling, { x: 0, y: 0 });                    
                    }
                    // else {
                    //     if (ballX > 0) {
                    //         if (intervalId) {
                    //             clearInterval(intervalId);
                    //         }
                    //         intervalId = setInterval(() => {
                    //             console.log(Date());
                    //             socketManager.sendTestingSendBallUpdate({
                    //                 gameId: gameId,
                    //                 position: ball.position,
                    //                 velocity: ball.velocity,
                    //                 edge: "paddle",
                    //                 worldWidth: worldWidth
                    //             });
                    //         }, 5000);
                    //     }
                    // }
                    updatePaddlesgame(gameId);
                }
                Events.on(engine, 'beforeUpdate', beforeUpdateHnadler);

            } catch (error) {
                console.error("Error creating game", error);
            }
        }
        if (gameStarted)
            createGame();
    }, [gameStarted])

    useEffect(() => {
        const handleGameEnd = () => {
            console.log("SETUP GAME END LISTSNER");
            if (socketManager) {
                socketManager.waitForConnection(async () => {
                    socketManager.onGameFinished((data) => {
                        console.log("GAME ENDED !!");
                        setUser(DEFAULT_VALUES.user);
                        setEnemyPlayer(DEFAULT_VALUES.enemyPlayer);
                        setPlayerFound(DEFAULT_VALUES.playerFound);
                        setSelectedMap(DEFAULT_VALUES.selectedMap);
                        setGameStarted(DEFAULT_VALUES.gameStarted);
                        setMyScore(DEFAULT_VALUES.myScore);
                        setEnemyScore(DEFAULT_VALUES.enemyScore);
                        setStartGame(DEFAULT_VALUES.startGame);
                        setGameId(DEFAULT_VALUES.gameId);
                        currentGameId = 0;
                        currentUserId = 0;
                        ballX = 4;
                        ballY = 4;
                        isPaddlePosSent = false;
                        isBallSent = false;
                        isScoreSent = false;
                        window.removeEventListener('keydown', handleKeyDown);
                        window.removeEventListener('keyup', handleKeyUp);
                        window.removeEventListener('unload', handleBeforeUnload);
                        Events.off(engine, 'beforeUpdate', beforeUpdateHnadler);
                        Events.off(engine, 'collisionStart', colisionHandler);
                        router.push('/pong');
                    })
                })
            }
        }
        handleGameEnd();
    }, [])

    useEffect(() => {
        console.log("SETUP NEW KEYS HANDLERS");
        handleKeyUp = (event: any) => {
            if (keys.hasOwnProperty(event.code)) {
                event.preventDefault();
                keys[event.code] = true;
            }
        }
        window.addEventListener('keydown', handleKeyUp);

        handleKeyDown = (event: any) => {
            if (keys.hasOwnProperty(event.code)) {
                event.preventDefault();
                keys[event.code] = false;
            }
        }
        window.addEventListener('keyup', handleKeyDown);
    }, [myScore, enemyScore])


    // useEffect(() => {
    //     handleBeforeUnload = async () => {
    //         if (socketManager) {
    //             socketManager.waitForConnection(async () => {
    //                 try {

    //                     setUser(DEFAULT_VALUES.user);
    //                     setEnemyPlayer(DEFAULT_VALUES.enemyPlayer);
    //                     setPlayerFound(DEFAULT_VALUES.playerFound);
    //                     setSelectedMap(DEFAULT_VALUES.selectedMap);
    //                     setGameStarted(DEFAULT_VALUES.gameStarted);
    //                     setMyScore(DEFAULT_VALUES.myScore);
    //                     setEnemyScore(DEFAULT_VALUES.enemyScore);
    //                     setStartGame(DEFAULT_VALUES.startGame);
    //                     setGameId(DEFAULT_VALUES.gameId);
    //                     currentGameId = 0;
    //                     currentUserId = 0;
    //                     ballX = 4;
    //                     ballY = 4;
    //                     isPaddlePosSent = false;
    //                     isBallSent = false;
    //                     isScoreSent = false;
    //                     window.removeEventListener('keydown', handleKeyDown);
    //                     window.removeEventListener('keyup', handleKeyUp);
    //                     window.removeEventListener('unload', handleBeforeUnload);
    //                     Events.off(engine, 'beforeUpdate', beforeUpdateHnadler);
    //                     Events.off(engine, 'collisionStart', colisionHandler);
    //                     // await socketManager.sendGameEnd({ gameId: gameId, enemy: enemyPlayer?.userId });
    //                     router.push('/pong');
    //                     // window.location.reload();
    //                     console.log("BEFORE UNLOAD");
    //                 } catch (error) {
    //                     console.log("Error in send game end ", error);
    //                 }
    //             })
    //         }
    //     }
    //     window.addEventListener('unload', handleBeforeUnload);
    // }, []);



    const unloadFlag = useRef(false);

    const handleBeforeUnload = async (event: any) => {
        if (socketManager && !unloadFlag.current) {

            console.log("BEFORE UNLOAD");
            unloadFlag.current = true;

            setUser(DEFAULT_VALUES.user);
            setEnemyPlayer(DEFAULT_VALUES.enemyPlayer);
            setPlayerFound(DEFAULT_VALUES.playerFound);
            setSelectedMap(DEFAULT_VALUES.selectedMap);
            setGameStarted(DEFAULT_VALUES.gameStarted);
            setMyScore(DEFAULT_VALUES.myScore);
            setEnemyScore(DEFAULT_VALUES.enemyScore);
            setStartGame(DEFAULT_VALUES.startGame);
            setGameId(DEFAULT_VALUES.gameId);
            currentGameId = 0;
            currentUserId = 0;
            ballX = 4;
            ballY = 4;
            isPaddlePosSent = false;
            isBallSent = false;
            isScoreSent = false;
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            // window.removeEventListener('unload', handleBeforeUnload);
            Events.off(engine, 'beforeUpdate', beforeUpdateHnadler);
            Events.off(engine, 'collisionStart', colisionHandler);

            window.removeEventListener('beforeunload', handleBeforeUnload);

            setTimeout(() => {
                window.location.href = '/pong';
            }, 1);
        }
    };

    useEffect(() => {
        const beforeUnloadListener = (event: any) => {
            handleBeforeUnload(event);
        };

        window.addEventListener('beforeunload', beforeUnloadListener);

        return () => {
            console.log("Cleanup");
            window.removeEventListener('beforeunload', beforeUnloadListener);
        };
    }, []);





    const handleMapClick = (map: string) => {
        console.log("MAP CLICKED : ", map, selectedMap);
        if (!selectedMap && map) {
            setSelectedMap(map);
        }
    };

    return (
        startGame ? (
            <div className='w-full h-screen flex flex-col items-center justify-center'>
                <div className="p-4 text-white">
                    <ScoreCard playerOne={user} playerTwo={enemyPlayer} myScore={myScore} enemyScore={enemyScore} />
                </div>
                <div className='aspect-w-2 aspect-h-3 md:aspect-w-16 md:aspect-h-9 border-2 border-black z-30' ref={boxRef} style={{
                    backgroundImage: `url(${selectedMap})`,
                    backgroundSize: "100% 100%",
                    backgroundRepeat: "no-repeat",
                    border: "solid 1px red",
                    backgroundPosition: "center",

                    position: "relative"
                }}>
                    <canvas className='w-full h-full border-2 border-black z-30' id="myCanva" ref={canvasRef} />
                </div>


            </div>
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
                            <a onClick={() => handleMapClick('/map1.png')}
                                className={`cursor-pointer ${selectedMap === '/map1.png' ? 'border border-[#77DFF8]' : ''}`}>
                                <Image
                                    src="/map_1.png"
                                    alt="Game Map 1"
                                    width={100}
                                    height={100}
                                    className="cursor-pointer"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </a>
                            <a onClick={() => handleMapClick('/map2.png')}
                                className={`cursor-pointer ${selectedMap === '/map2.png' ? 'border border-[#77DFF8]' : ''}`}>
                                <Image
                                    src="/map_2.png"
                                    alt="Game Map 2"
                                    width={100}
                                    height={100}
                                    className="cursor-pointer"
                                    style={{ width: 'auto', height: 'auto' }}
                                />
                            </a>
                            <a onClick={() => handleMapClick('/map3.png')}
                                className={`cursor-pointer ${selectedMap === '/map3.png' ? 'border border-[#77DFF8]' : ''}`}>
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
                    </div>
                ) : (
                    <div>
                        <button onClick={handleCancel} className="btn  lg:h-12 bg-red-500 mt-10 mb-10 text-xs lg:text-sm">
                            Cancel matchmaking
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none" className="ml-2 w-4 h-4 md:w-8 md:h-8 hidden lg:block">
                                <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.55 2 2.5 8.05 2.5 15.5C2.5 22.95 8.55 29 16 29C16.53 29 17.051 28.962 17.566 28.902L17.582 28.918L17.6 28.898C24.296 28.105 29.5 22.408 29.5 15.5C29.5 8.593 24.296 2.9 17.602 2.105C17.585 2.091 17.57 2.075 17.552 2.061V2.055L17.522 2.092C17.021 2.035 16.514 2 16 2ZM15.5 3.025V8H11.16C12.077 6.057 13.334 4.372 14.836 3.059C15.055 3.039 15.278 3.034 15.5 3.025ZM16.5 3.025C16.723 3.035 16.947 3.038 17.166 3.059C18.671 4.372 19.931 6.054 20.85 8H16.5V3.025ZM13.076 3.357C11.8117 4.72297 10.7873 6.29273 10.046 8H6.015C7.75713 5.67785 10.2535 4.03592 13.076 3.357ZM18.922 3.357C21.7453 4.03541 24.2434 5.67741 25.986 8H21.96C21.2167 6.29216 20.1889 4.72235 18.922 3.357ZM5.336 9H9.646C8.94326 10.9247 8.56086 12.9516 8.514 15H3.525C3.60535 12.8781 4.22953 10.8123 5.336 9ZM10.738 9H15.5V15H9.514C9.56888 12.9439 9.98313 10.9133 10.738 9ZM16.5 9H21.27C22.025 10.9133 22.4392 12.9439 22.494 15H16.5V9ZM22.36 9H26.664C27.7705 10.8123 28.3937 12.8781 28.474 15H23.494C23.4462 12.9514 23.0628 10.9245 22.359 9H22.36ZM3.524 16H8.513C8.55979 18.0484 8.94219 20.0753 9.645 22H5.334C4.22809 20.1875 3.60527 18.1217 3.525 16H3.524ZM9.513 16H15.5V22H10.738C9.98315 20.0867 9.5689 18.0561 9.514 16H9.513ZM16.499 16H22.468C22.362 17.883 21.848 19.953 20.95 22H16.5L16.499 16ZM23.469 16H28.474C28.3937 18.1217 27.7709 20.1875 26.665 22H22.036C22.879 19.97 23.371 17.916 23.469 16ZM6.015 23H10.048C10.7893 24.7073 11.8137 26.277 13.078 27.643C10.2543 26.965 7.75565 25.323 6.013 23H6.015ZM11.161 23H15.501V27.975C15.28 27.965 15.057 27.961 14.839 27.941C13.335 26.628 12.079 24.945 11.161 23ZM16.501 23H20.464C19.5719 24.7929 18.4406 26.4564 17.101 27.945C16.903 27.963 16.701 27.967 16.501 27.975V23ZM21.589 23H25.987C24.1797 25.4155 21.5581 27.0942 18.608 27.725C19.7872 26.2754 20.7874 24.6889 21.587 23H21.589Z" fill="white" />
                                <circle cx="23" cy="11" r="2" fill="#77DFF8" />
                                <circle cx="9" cy="17" r="2" fill="#77DFF8" />
                                <circle cx="23" cy="23" r="2" fill="#77DFF8" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        )
    )
}
