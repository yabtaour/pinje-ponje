'use client';

import { Input } from "@nextui-org/react";
import { useState } from "react";

export default function ChatInput() {

    const [value, setValue] = useState("")


    // useEffect(() => {
    //     console.log(value);
    // }, [value]);

    return (
        <div className="bg-[#151424] flex justify-center w-[70%] absolute  p-10" style={{
            bottom: 0,
            color: '#817EC4'
        }}>
            <Input

                type="text"

                placeholder="Type a message"
                className="bg-[#1B1A2D] text-white w-[100%]"
                radius={'md'}
                value={value}
                onValueChange={setValue}
                endContent={
                    <button onClick={
                        () => {
                            console.log(value);
                            setValue("")
                        }
                    } className="bg-[#1B1A2D] rounded-full p-2 hover:bg-[#817EC4]">
                        <svg width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="currentColor" d="M3 20V4l19 8l-19 8Zm2-3l11.85-5L5 7v3.5l6 1.5l-6 1.5V17Zm0 0V7v10Z" />
                        </svg>
                    </button>
                }
            />
        </div>
    );
}