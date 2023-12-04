'use strict';
'use client';
import SocketManager from '@/app/utils/socketManager';
import { getCookie } from 'cookies-next';
import Matter, { Body, Events } from 'matter-js';
import { useEffect, useRef, useState } from 'react';


const token = getCookie("token")

export const Engine = Matter.Engine;
export const Render = Matter.Render;
export const World = Matter.World;
export const Bodies = Matter.Bodies;
export const Runner = Matter.Runner;

let ball: Matter.Body;
let floor: Matter.Body;
let ceiling: Matter.Body;
let rightPaddle: Matter.Body;
let leftPaddle: Matter.Body;
let gameId: number;

const keys: any = {
  ArrowUp: false,
  ArrowDown: false,
  KeyW: false,
  KeyS: false,
};

export function createBodies(canvaWidth: number, canvaHeight: number) {
  ball = Bodies.circle(canvaWidth / 2, canvaHeight / 2, 15, { 
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
  rightPaddle = Bodies.rectangle(canvaWidth - 20, canvaHeight / 2, 20, 150, {
    isStatic: true,
    render: {
      fillStyle: "#4E40F4",
      
    }
  });
  leftPaddle = Bodies.rectangle(20, canvaHeight / 2, 20, 150, {
    isStatic: true,
    render: {
      fillStyle: "#4E40F4"
    }
  });
  floor = Bodies.rectangle(0, canvaHeight, canvaWidth * 2, 5, { isStatic: true });
  ceiling = Bodies.rectangle(0, 0, canvaWidth * 2, 5, { isStatic: true });

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


export function updatePaddles(canvaHeight: number, canvaWidth: number) {
  if (keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 30) {
    Body.translate(leftPaddle, { x: 0, y: -5 });
  }
  if (keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < canvaHeight - 30) {
    Body.translate(leftPaddle, { x: 0, y: 5 });
  }
}

export default function Game() {


  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [initialGameData, setInitialGameData] = useState<any>(null);

  const socketManager = SocketManager.getInstance();


  useEffect(() => {

    const initializeGame = async () => {
      await new Promise<void>((resolve: () => void) => socketManager.waitForConnection(resolve));
      try {
        const initialGameData = await socketManager.onStartGame();
        console.log("Received initial game data:", initialGameData);
        setInitialGameData(initialGameData);
        setGameStarted(true);
      } catch (error) {
        console.log(error);
      }
    }
    initializeGame();

    const worldWidth = canvasRef.current?.width! * 2;
    const worldHeight = canvasRef.current?.height! * 2;
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
    const canvaWidth = canvasRef.current?.width!;
    const canvaHeight = canvasRef.current?.height!;
    World.add(engine.world, [ball, floor, ceiling, leftPaddle, rightPaddle]);
     
    window.addEventListener('keydown', (event) => {
      if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = true;
      }
    })
    window.addEventListener('keyup', (event) => {
      if (keys.hasOwnProperty(event.code)) {
        keys[event.code] = false;
      }
    })

    Events.on(engine, 'beforeUpdate', () => {
      updatePaddles(canvaHeight, canvaWidth);
    });

    Engine.run(engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        handleColision(pair, bodyA, bodyB)
      });
    });

    return() => {
      Render.stop(render);
      World.clear(engine.world , false);
      Engine.clear(engine);

    }

  }, []);

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-2/3 h-2/4 border-2 border-black z-30' ref={boxRef}>
        <canvas className='w-full h-full border-2 border-black z-30 ' id="myCanva" ref={canvasRef} />
      </div>
    </div>
  );
}