// 'use client';
// import React, { useEffect } from 'react';
// import { Engine, Render, World, Bodies, Body, Events } from 'matter-js';

// const PingPongGame: React.FC = () => {
//     useEffect(() => {
//     // Matter.js setup goes here
//     const engine = Engine.create();
//     const render = Render.create({
//         element: document.getElementById('gameContainer')!,
//         engine: engine,
//     });
//     const World = engine.world;
//     const ball = Bodies.circle(400, 300, 20, {
//         restitution: 0.8,
//         friction: 0,
//         render: {
//             fillStyle: '#ffffff',
//             },
//         });
//     });
//     const rectangle = Bodies.rectangle(400, 500, 80, 80);
//     return () => {
//         Render.stop(render);
//         Engine.clear(engine);
//         World.remove(World, ball);
//     };
// }, []); // Run once on component mount

//     // return (
//     //     <div id="gameContainer" style={{ width: '800px', height: '600px', margin: 'auto' }}>
//     //     {/* The canvas will be rendered here */}
//     //     </div>
//     // );
// // }

// export default PingPongGame;
'use client';
import { Bodies, Engine, Render, World } from 'matter-js';
import { useEffect } from 'react';

export default function PingPongGame() {
  useEffect(() => {
    // Matter.js setup goes here
    const containerStyles = getComputedStyle(document.getElementById('gameContainer')!);
    console.log("containerStyles",containerStyles);
    console.log("containerStyles",containerStyles.width);
    console.log("containerStyles",containerStyles.height);
    const engine = Engine.create();
    const render = Render.create({
      element: document.getElementById('gameContainer')!,
      engine: engine,
      options: {
        // gravity: {
        //     x: 0,
        //     y: 0,
        // },
        // width: Number(containerStyles.width),
        // wireframeBackground: 'transparent',
        // width: (window.innerWidth / 3) + (window.innerWidth / 3),
        // width: 800,
        // height: parseFloat(containerStyles.height) - 200,
        // height: 600,
        // height: window.innerHeight / 5 ,
        // wireframes: false,
        // width: canvasWidth,
        background: 'transparent',
      },
    });

    const world = engine.world;
    console.log("hamid",world);
    // console.log(world);

    const ball = Bodies.circle(400, 300, 20, {
        restitution: 0.8,
        friction: 0,
        render: {
            fillStyle: '#000',
        },
    });
    const rectangle1 = Bodies.rectangle(200, 20, 20, 20);
    const rectangle2 = Bodies.rectangle(20, 20, 20, 20);

    // Add bodies to the world
    World.add(world, [ball, rectangle1, rectangle2]);
// 
    // Add the renderer to the page
    Engine.run(engine);
    Render.run(render);

    // Run the engine

    // Cleanup on component unmount
    return () => {
      Render.stop(render);
      World.remove(world, ball);
      Engine.clear(engine);
    };
  }, []); // Run once on component mount

  return (
    <div className='w-full h-full flex items-center justify-center'>

        <div className='w-2/3 h-1/2 border-2 border-black z-30	' id='gameContainer'> 

        </div>
    </div>
//     <div id="gameContainer" style={
//         {
//             width: '800px',
//             height: '600px',
//             margin: 'auto',

//             border: '1px solid black',
//         }
//     }>
//       {/* The canvas will be rendered here */}
//     </div>
  );
};


