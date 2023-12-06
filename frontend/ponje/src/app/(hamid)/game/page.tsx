'use strict';
'use client';
import SocketManager from '@/app/utils/socketManager';

import { getCookie } from 'cookies-next';
import Matter, { Body, Events } from 'matter-js';
import { useEffect, useRef, useState } from 'react';

export const Engine = Matter.Engine;
export const Render = Matter.Render;
export const World = Matter.World;
export const Bodies = Matter.Bodies;
// export const Runner = Matter.Runner;

const token = getCookie("token")
// const gameSocket = io("http://localhost:3000/game", {
//   extraHeaders: {
//     authorization: `${token}`,
//   }
// });

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
  KeyW: false,
  KeyS: false,
};

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


export function updatePaddles() {
  if (keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 10) {
    Body.translate(leftPaddle, { x: 0, y: -2 });
  }
  if (keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < worldHeight - 10) {
    Body.translate(leftPaddle, { x: 0, y: 2 });
  }
}

export default function Game() {


  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let [gameStarted, setGameStarted] = useState(false);
  let [initialGameData, setInitialGameData] = useState<any>(null);
  const socketManager = SocketManager.getInstance("http://localhost:3000", token);




  // console.log(gameSocket);


  useEffect(() => {
    worldWidth = canvasRef.current?.width! * 4;
    worldHeight = canvasRef.current?.height! * 4;
    canvaWidth = canvasRef.current?.width!;
    canvaHeight = canvasRef.current?.height!;
    console.log(canvasRef.current?.width)
    socketManager.waitForConnection(async () => {
      socketManager.khouyaSawbLgame();
    });
    // gameSocket.emit('khouyaSawbLgame');
    const initializeGame = async () => {
      let data;
      socketManager.waitForConnection(async () => {

        data = await socketManager.onstartGame();
        console.log(data);
        console.log("DATA WSLAAT");
        if (!gameStarted) {
          console.log(worldWidth, worldHeight, canvaWidth, canvaHeight)
          console.log("state updated")
          setInitialGameData(data);
          setGameStarted(true);
          gameStarted = true;
          initialGameData = data;
        }
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
        window.addEventListener('keydown', (event) => {
          // event.preventDefault();
          if (keys.hasOwnProperty(event.code)) {
            keys[event.code] = true;
          }
        })
        window.addEventListener('keyup', (event) => {
          if (keys.hasOwnProperty(event.code)) {
            // event.preventDefault();
            keys[event.code] = false;
          }
        })

        Events.on(engine, 'beforeUpdate', () => {
          updatePaddles();
        });


        Engine.run(engine);
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
      });
      // gameSocket.on('startGame', (data) => {
      // })
    }
    initializeGame()
  }, [gameStarted, initialGameData]);

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      {gameStarted ? (
        <div className='w-2/3 h-2/3 border-2 border-black z-30' ref={boxRef}>
          <canvas className='w-full h-full border-2 border-black z-30' id="myCanva" ref={canvasRef} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}