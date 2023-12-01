'use strict';
'use client';
import { background } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';
import Matter, { Body, Events } from 'matter-js';
import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client'


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

// const socket = io('ws://localhost:3000/game', {
//   extraHeaders: {
//     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwiaWF0IjoxNzAxNDI4OTM3LCJleHAiOjE3MDQwMjA5Mzd9.Sec9reKgBs1igF3mI-RrlRDs0XatAPBc8f9actBtWhE`,
//   },
// });

const sock =  io('ws://localhost:3000/game', {
  extraHeaders: {
    Authorization: `${token}`,
  },
});

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
    // console.log("BAAAAAALL !! ", ball.speed)
    let otherBody = bodyA === ball ? bodyB : bodyA;
    if (otherBody === floor || otherBody === ceiling) {
      Body.setVelocity(ball, {
        x: ball.velocity.x,
        y: -ball.velocity.y
      })
    }
    else if (otherBody === leftPaddle || otherBody === rightPaddle) {
      // console.log("paddle touched !!!!!!!!!!!! ")
      Body.setVelocity(ball, {
        x: -ball.velocity.x,
        y: ball.velocity.y
      })
    }
  }
}


export function updatePaddles(canvaHeight: number, canvaWidth: number) {
  // console.log(keys);
  if (keys['ArrowUp'] && leftPaddle.position.y - 100 / 2 > 30) {
    // console.log("lfo9");
    sock.emit('updatePlayerPosition', )
    Body.translate(leftPaddle, { x: 0, y: -5 });
  }
  if (keys['ArrowDown'] && leftPaddle.position.y + 100 / 2 < canvaHeight - 30) {
    // console.log("lte7t");
    Body.translate(leftPaddle, { x: 0, y: 5 });
  }
}

export default function Game() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // let sock  : Socket | null = null;

  useEffect(() => {


    // sock =  io('ws://localhost:3000/game', {
    //   extraHeaders: {
    //     Authorization: `${token}`,
    //   },
    // });

    sock?.on('connect' , () =>  {  
      sock?.on('message', (data) => {
        console.log('messages received : ', data);
      })
    })

    sock?.on('startGame', (data) => {
      console.log("gameState initialized !! ", data);
      
    })

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
    const worlBodies = createBodies(canvaWidth, canvaHeight)
    World.add(engine.world, [ball, floor, ceiling, leftPaddle, rightPaddle]);
     
    window.addEventListener('keydown', (event) => {
      if (keys.hasOwnProperty(event.code)) {
        // console.log("press");
        keys[event.code] = true;
      }
    })
    window.addEventListener('keyup', (event) => {
      if (keys.hasOwnProperty(event.code)) {
        // console.log("unpress");
        keys[event.code] = false;
      }
    })

    Events.on(engine, 'beforeUpdate', () => {
      // console.log("chi haja trat");
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
    // console.log("hamd");

    // Engine.update(engine, delta)
    return() => {
      sock?.disconnect()
      Render.stop(render);
      World.clear(engine.world , false);
      Engine.clear(engine);

    }

  }, []);

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div  className='w-2/3 h-2/3 border-2 border-black z-30' ref={boxRef}>
        <canvas className='w-full h-full border-2 border-black z-30 ' id="myCanva" ref={canvasRef} />

        {/* <img ref={imgRef}  src="https://w7.pngwing.com/pngs/108/741/png-transparent-ping-pong-ball-table-amazon-com-craft-ping-pong-sphere-sports-business.png" style={{ position: 'absolute', display:'none' , top: 0, left: 0, width: 40, height: 40 }} alt="paddle" /> */}
      </div>
    </div>
  );
}