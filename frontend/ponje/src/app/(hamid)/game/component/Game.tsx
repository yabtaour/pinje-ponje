
'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import Matter, { Body, Events } from 'matter-js';
import { ClimbingBoxLoader } from 'react-spinners';

// export interface gameInfo = {

// }


export default function Game() {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const Engine = Matter.Engine;
    const Render = Matter.Render;
    const World = Matter.World;
    const Bodies = Matter.Bodies;
    const Runner = Matter.Runner;
    const canvaWidth = canvasRef.current?.width!;
    const canvaHeight = canvasRef.current?.height!;
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
    const floor = Bodies.rectangle(0, canvasRef.current?.height!, canvasRef.current?.width! * 2, 5, { isStatic: true });
    const ceiling = Bodies.rectangle(0, 0, canvasRef.current?.width! * 2, 5, { isStatic: true });
    const ball = Bodies.circle(canvasRef.current?.width! / 2, canvasRef.current?.height! / 2, 10, { 
      restitution: 1,
    });
    const rightPaddle = Bodies.rectangle(canvasRef.current?.width! - 10, canvasRef.current?.height! / 2, 10, 100, { isStatic: true });
    const leftPaddle = Bodies.rectangle(10, canvasRef.current?.height! / 2, 10, 100, { isStatic: true });
  
    const dottedLine = Bodies.rectangle(worldWidth / 2, worldWidth / 2, worldWidth, 2, {
      isStatic: true,
      render: {
        fillStyle: 'transparent',
        strokeStyle: 'black',
        lineWidth: 2,
      },
    });

    Body.setVelocity(ball, {
      x: 10,
      y: 0
    })
    World.add(engine.world, [floor,  ceiling, rightPaddle, leftPaddle, ball, dottedLine]);
    Runner.create({

    });
    Runner.run(engine);
    Engine.run(engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair;
        let ballOnFloor = false;
        let ballOnCeiling = false;
        // Check if the collision involves the ball
        if (bodyA === ball || bodyB === ball) {
          // Check if the ball is colliding with the floor
          if ((bodyA === floor || bodyB === floor) && !ballOnFloor) {
            console.log(ball);
            Body.setVelocity(ball, {
              x: 0,
              y: 7
            })
            console.log("floor collision")
            ballOnFloor = true;
            // ballOnFloor = true; // Set the flag to true when on the floor
          } else if ((bodyA === ceiling || bodyB === ceiling) && !ballOnCeiling) {
            console.log(ball);
            Body.setVelocity(ball, {
              x: 0,
              y: 7
            })
            ballOnCeiling = true;
          }

          // Check if the ball is colliding with the ceiling
          if (bodyA === ceiling || bodyB === ceiling) {
            ball.velocity.x = 0;
            ball.velocity.y = 0;
          }
        }
      });
    });
    console.log("hamd");

    const runner = Runner.create();

    Runner.run(runner, engine);
    Render.run(render);

    // Engine.update(engine, delta)
    return() => {
      Render.stop(render);
      Runner.stop(runner);
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