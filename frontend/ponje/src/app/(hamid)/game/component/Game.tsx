'use client';
import React, { useEffect } from 'react';
import { Engine, Render, World, Bodies, Body, Events } from 'matter-js';

const PingPongGame: React.FC = () => {
    useEffect(() => {
      // Matter.js setup goes here
  
      return () => {
        // Cleanup code if needed
      };
    }, []); // Run once on component mount
  
    return (
      <div id="gameContainer" style={{ width: '800px', height: '600px', margin: 'auto' }}>
        {/* The canvas will be rendered here */}
      </div>
    );
  };
  