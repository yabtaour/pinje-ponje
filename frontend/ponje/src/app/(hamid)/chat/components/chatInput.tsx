'use client';

import { Input } from "@nextui-org/react";

export default function ChatInput() {
    return (

        <div className="bg-[#151424]  absolute  p-10" style={{
            bottom: 0,
            color: '#817EC4'
        }}>

            <Input
                style={{
                    width: 'screen',
                }}
                type="text"
                defaultValue=""
                placeholder="Type a message"
                className="max-w-xs"
                endContent={
                    <button className="bg-[#1B1A2D] rounded-full p-2">
                        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M3 20V4l19 8l-19 8Zm2-3l11.85-5L5 7v3.5l6 1.5l-6 1.5V17Zm0 0V7v10Z" />
                        </svg>
                    </button>
                }
            />
        </div>
    );
}