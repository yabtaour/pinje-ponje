
'use client';
import Matter, { Body, Events } from 'matter-js';
import { useEffect, useRef } from 'react';

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

export function createBodies(canvaWidth: number, canvaHeight: number) {
  ball = Bodies.circle(canvaWidth / 2, canvaHeight / 2, 10, { 
    restitution: 1,
    frictionAir: 0,
    // isStatic: true,
  });
  Body.setVelocity(ball, {
    x: 0,
    y: 5
  })
  rightPaddle = Bodies.rectangle(canvaWidth - 10, canvaHeight / 2, 10, 100);
  leftPaddle = Bodies.rectangle(10, canvaHeight / 2, 10, 100);
  floor = Bodies.rectangle(0, canvaHeight, canvaWidth * 2, 5, { isStatic: true });
  ceiling = Bodies.rectangle(0, 0, canvaWidth * 2, 5, { isStatic: true });
  return ([rightPaddle, leftPaddle, ball, floor, ceiling])
}

export function handleColision(bodyA: Matter.Body, bodyB: Matter.Body) {
  // [ball, floor, ceiling, rightPaddle, leftPaddle] = worlBodies;

  console.log("hnaaaaaaa")

  if (bodyA == ball || bodyB == ball) {
    console.log("it's a ball")
    if ((bodyA == floor || bodyB == floor)) {
      console.log(ball);
      Body.setVelocity(ball, {
        x: 0,
        y: 6
      })
      console.log("floor collision")
    } else if ((bodyA === ceiling || bodyB === ceiling)) {
      console.log(ball);
      Body.setVelocity(ball, {
        x: 0,
        y: 6
      })
      // ballOnCeiling = true;
    }

    if (bodyA === ceiling || bodyB === ceiling) {
      ball.velocity.x = 0;
      ball.velocity.y = 0;
    }
  }
}

export default function Game() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

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
        background: '',
      },
    });
    const canvaWidth = canvasRef.current?.width!;
    const canvaHeight = canvasRef.current?.height!;
    const worlBodies = createBodies(canvaWidth, canvaHeight)
    World.add(engine.world, [ball, floor, ceiling, leftPaddle, rightPaddle]);
    // [ball, floor, ceiling, rightPaddle, leftPaddle] = worlBodies;

    Engine.run(engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        console.log("hna ")
        handleColision(bodyA, bodyB)
      });
    });
    console.log("hamd");

    // Engine.update(engine, delta)
    return() => {
      Render.stop(render);
      World.clear(engine.world , false);
      Engine.clear(engine);

    }

  }, []);

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div  className='w-2/3 h-2/3 border-2 border-black z-30' ref={boxRef}>
        <canvas className='w-full h-full border-2 border-black z-30' id="myCanva" ref={canvasRef} />

        {/* <img ref={imgRef}  src="https://w7.pngwing.com/pngs/108/741/png-transparent-ping-pong-ball-table-amazon-com-craft-ping-pong-sphere-sports-business.png" style={{ position: 'absolute', display:'none' , top: 0, left: 0, width: 40, height: 40 }} alt="paddle" /> */}
      </div>
    </div>
  );
}