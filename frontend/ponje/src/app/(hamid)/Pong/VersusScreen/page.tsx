'use client'
import axios from "@/app/utils/axios";
import SocketManager from '@/app/utils/socketManager';
import Matter, { Body, Events } from 'matter-js';
import Image from 'next/image';
import { useEffect, useRef, useState } from "react";
import PlayerCard, { PlayerSkeleton } from '../components/PlayerCard';
let token: string | undefined = localStorage.getItem('access_token')!;
const SocketManagerGame = SocketManager.getInstance("http://localhost:3000", token);
import _ from 'lodash';
import { Toast } from '@chakra-ui/react';
import { getCookie } from "cookies-next";



export const Engine = Matter.Engine;
export const Render = Matter.Render;
export const World = Matter.World;
export const Bodies = Matter.Bodies;

let ball: Matter.Body;
let floor: Matter.Body;
let ceiling: Matter.Body;
let rightPaddle: Matter.Body;
let leftPaddle: Matter.Body;

let worldHeight: number;
let worldWidth: number;
let canvaHeight: number;
let canvaWidth: number;

const keys: any = {
    ArrowUp: false,
    ArrowDown: false,
};

let gameId = 0;
let currentUserId = 0;

export function createBodies() {
    ball = Bodies.circle(worldWidth / 2, worldHeight / 2, 15, {
      restitution: 1,
      frictionAir: 0,
      friction: 0,
      render: {
        fillStyle: "#73d3ff"
      }
    });
    Body.setVelocity(ball, {
      x: 3,
      y: 3,
    })
    rightPaddle = Bodies.rectangle(worldWidth - 20, worldHeight / 2, 20, 100, {
      isStatic: true,
      render: {
        fillStyle: "#4E40F4",
      }
    });
    leftPaddle = Bodies.rectangle(20, worldHeight / 2, 20, 100, {
      isStatic: true,
      render: {
        fillStyle: "#4E40F4"
      }
    });
    floor = Bodies.rectangle(0, worldHeight, worldWidth * 2, 5, { isStatic: true });
    ceiling = Bodies.rectangle(0, 0, worldWidth * 2, 5, { isStatic: true });
  
    return ([rightPaddle, leftPaddle, ball, floor, ceiling])
}

export function handleColision(pair: any, bodyA: Matter.Body, bodyB: Matter.Body) {

    if (bodyA == ball || bodyB == ball) {
      let otherBody = bodyA === ball ? bodyB : bodyA;
      if (otherBody === floor || otherBody === ceiling) {
        Body.setVelocity(ball, {
          x: ball.velocity.x,
          y: -ball.velocity.y
        })
      }
      else if (otherBody === leftPaddle || otherBody === rightPaddle) {
        Body.setVelocity(ball, {
          x: -ball.velocity.x,
          y: ball.velocity.y
        })
      }
    }
}

let isSent = false;

const localPrediction = (direction: string) => {
    if (direction === 'up' && leftPaddle.position.y - 100 / 2 > 10) {
        Body.translate(leftPaddle, { x: 0, y: -10 });
    } else if (direction === 'down' && leftPaddle.position.y + 100 / 2 < worldHeight - 10) {
        Body.translate(leftPaddle, { x: 0, y: 10 });
    }
};

export function updatePaddlesgame(gameId: number) {
    if (keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 10) {
        // Body.translate(leftPaddle, { x: 0, y: -10 });
        // localPrediction('up');
        SocketManagerGame.sendPaddlePosition({ gameId: gameId, direction: 'up' });
        isSent = true;
    }
    if (keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < worldHeight - 10) {
        // Body.translate(leftPaddle, { x: 0, y: 10 });
        // localPrediction('down');
        SocketManagerGame.sendPaddlePosition({ gameId: gameId, direction: 'down' });
        isSent = true;
    }
}

export default function VersusScreen() {
    const [playerFound, setPlayerFound] = useState(false);
    const [enemyPlayer, setEnemyPlayer] = useState<any>(null);
    const [selectedMap, setSelectedMap] = useState('');
    const [loading, setLoading] = useState(true);
    const [currentUserId, setcurrentUserId] = useState(0);
    const SocketManagerGame = SocketManager.getInstance("http://localhost:3000",`${localStorage.getItem('access_token')}`);
    const token = getCookie("token");
    // const SocketManagerGame = SocketManager.getInstance("http://localhost:3000", token);

    const [user, setUser] = useState(null);
    const [startGame, setStartGame] = useState(false);
    const [sentInitialize, setSentInitialize] = useState(false);
    const [readyToInitialize, setReadyToInitialize] = useState(false);
    
    const boxRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);    
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await axios.get(`http://localhost:3000/users/me`, {
                    headers: {
                        Authorization: `${localStorage.getItem('access_token')}`,
                        // Authorization: token,
                    },
                });
                setUser(data.data);
                setcurrentUserId(data.data.id)
            // } catch (err) {
            //     console.error("Error when fetching user's data");
            //     setLoading(false);
            //     // console.log(data.data);
            //     const loggedUserId = data.data.id;
            //     setcurrentUserId(loggedUserId);
            } catch (err) {
                Toast({
                    title: 'Error',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                });
                console.error("Error in fetchData:", err);
                setLoading(false);
            }
        };
    
        const waitForNewGame = async () => {
            if (SocketManagerGame) {
                SocketManagerGame.waitForConnection(async () => {
                    try {
                        let data = await SocketManagerGame.onNewGame();
                        if (data) {
                            gameId = data.id;
                            const otherUser = data.players.find((player: any) => player.userId !== currentUserId);
                            setEnemyPlayer(otherUser);
                            setPlayerFound(true);
                        }
                    } catch (error) {
                        console.error("Error in onNewGame:", error);
                    }
                });
            }
        };
    
        const initializeGame = async () => {
            if (selectedMap && SocketManagerGame) {
                SocketManagerGame.waitForConnection(async () => {
                    try {
                        setReadyToInitialize(true);
                        let data = await SocketManagerGame.onStartGame();
                        if (data)  {
                            setStartGame(true);
                        };
                    } catch (error) {
                        console.error("Error in sendInitialize:", error);
                    }
                });
            }
        };
    
        const sendInitialization = async () => {
            if (selectedMap && !sentInitialize && SocketManagerGame) {
                SocketManagerGame.waitForConnection(async () => {
                    try {
                        await SocketManagerGame.sendIntialization({ gameId: gameId, playerPos: 30, ballVel: 3 });
                        setSentInitialize(true);
                    } catch (error) {
                        console.error("Error in sendInitialize:", error);
                    }
                });
            }
        };
    
        // const handlePaddlePosition = () => {
        //     if (startGame && SocketManagerGame) {
        //         SocketManagerGame.waitForConnection(() => {
        //             SocketManagerGame.onPaddlePosition().then((data) => {
        //                 console.log("chi haja jaat");
        //                 console.log(data);
        //                 isSent = false;
        //                 const { playerId, direction } = data;
        //                 if (playerId == currentUserId) {
        //                     if (direction == "up") {
        //                         Body.translate(leftPaddle, { x: 0, y: -3 });
        //                     } else {
        //                         Body.translate(leftPaddle, { x: 0, y: 3 });
        //                     }
        //                 } else {
        //                     if (direction == "up") {
        //                         Body.translate(rightPaddle, { x: 0, y: -3 });
        //                     } else {
        //                         Body.translate(rightPaddle, { x: 0, y: 3 });
        //                     }
        //                 }
        //                 // Continue processing the data or trigger other actions
        //             }).catch((error) => {
        //                 console.error("Error in onPaddlePosition:", error);
        //             });
        //         });
        //     }
        // };
        const handlePaddlePosition = () => {
            if (startGame && SocketManagerGame) {
              SocketManagerGame.waitForConnection(() => {
                SocketManagerGame.onPaddlePosition((data) => {
                  isSent = false;
                  const { playerId, direction } = data;
                  if (playerId == currentUserId) {
                    if (direction == "up") {
                      Body.setVelocity
                      Body.translate(leftPaddle, { x: 0, y: -3 });
                    } else {
                      Body.translate(leftPaddle, { x: 0, y: 3 });
                    }
                  } else {
                    if (direction == "up") {
                      Body.translate(rightPaddle, { x: 0, y: -3 });
                    } else {
                      Body.translate(rightPaddle, { x: 0, y: 3 });
                    }
                  }
                  // Continue processing the data or trigger other actions
                });
              });
            }
          };
          
        
    
        const createGame = () => {
            worldWidth = canvasRef.current?.width! * 4;
            worldHeight = canvasRef.current?.height! * 4;
            canvaWidth = canvasRef.current?.width!;
            canvaHeight = canvasRef.current?.height!;
    
            try {
                const engine = Engine.create({
                    gravity: {
                        x: 0,
                        y: 0,
                    }
                });
                const render = Render.create({
                    element: boxRef.current!,
                    canvas: canvasRef.current!,
                    engine: engine,
                    options: {
                        width: worldWidth,
                        height: worldHeight,
                        wireframes: false,
                        background: '#C2D9FF',
                    },
                });
                createBodies();
                World.add(engine.world, [ball, floor, ceiling, leftPaddle, rightPaddle]);
                console.log(leftPaddle);
                console.log(rightPaddle);

                // const throttledUpdatePaddles = _.throttle(updatePaddlesgame, 100);
                window.addEventListener('keydown', (event) => {
                    if (keys.hasOwnProperty(event.code)) {
                        event.preventDefault();
                        keys[event.code] = true;
                        // updatePaddlesgame(gameId);
                        // throttledUpdatePaddles(gameId);
                    }
                });
                window.addEventListener('keyup', (event) => {
                    if (keys.hasOwnProperty(event.code)) {
                        event.preventDefault();
                        keys[event.code] = false;
                    }
                });

                Events.on(engine, 'beforeUpdate', () => {
                    updatePaddlesgame(gameId);
                });               
    
                Matter.Runner.run(engine)
                Render.run(render);
                Events.on(engine, 'collisionStart', (event) => {
                    event.pairs.forEach((pair) => {
                        const { bodyA, bodyB } = pair;
                        handleColision(pair, bodyA, bodyB)
                    });
                });
    
                return () => {
                    Render.stop(render);
                    World.clear(engine.world, false);
                    Engine.clear(engine);
                }
            } catch (error) {
                console.error("Error creating game");
            }
        };
    
        if (!user || !currentUserId) fetchData();
        if (user && currentUserId) waitForNewGame();
        if (selectedMap && enemyPlayer && playerFound && !startGame) initializeGame();
        if (selectedMap && readyToInitialize) sendInitialization();
        if (startGame) handlePaddlePosition();
        if (startGame) createGame();
    }, [user, currentUserId, enemyPlayer, selectedMap, readyToInitialize, startGame, sentInitialize, leftPaddle, rightPaddle]);
    
    
    const handleMapClick = (map: string) => {
        console.log("map clicked");
        setSelectedMap(() => map);
    };

    return (
        startGame ? (
            <div className='w-full h-screen flex items-center justify-center'>
            <div className='w-2/3 h-2/3 border-2 border-black z-30' ref={boxRef}>
                <canvas className='w-full h-full border-2 border-black z-30' id="myCanva" ref={canvasRef} />
            </div>
    </div>
        ) : (
        <div className='min-h-screen bg-gradient-to-t from-[#2b2948] to-[#141321] flex flex-col justify-center items-center'>
            <div className='grid grid-cols-3'>
                <PlayerCard user={user} cardColor="#4A40BF" />
                <div className="flex items-center justify-center">
                    <svg width="208" height="189" viewBox="0 0 308 289" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-28 h-24 lg:w-52 lg:h-48">
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
                        <p className="text-[#77DFF8] text-xs md:text-sm bg-[#201e34] p-4 rounded-lg flex flex-row animate-pulse font-semibold">Looking for opponent
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" className="ml-2 w-3 h-3 md:w-5 md:h-5">
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
