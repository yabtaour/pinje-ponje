"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Confetti from 'react-confetti';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function GameResult(result: any) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    // const [result, setResult] = useState("");

    const handleHomeClick = () => {
        router.push('/profile');
    }
    // useEffect(() => {
    //     // setResult("win");
    //     setResult("loss");
    // }, []);

    console.log(result);
    console.log(result.result);
    const imageSrc = result.result === "win" ? "/win_icon.svg" : "/loss_icon.svg";
    const resultmssg = result.result === "win" ? "YOU WON!" : "YOU LOST :(";
    const textColor = result.result === "win" ? "text-green-500" : "text-red-500";
   
    const confettiConfig = {
        width: 410,
        height: 300,
        recycle: false,
        numberOfPieces: 50,
        gravity: 0.5,
    };

    return (
        <div className='w-screen h-screen bg-[#151424] '>
            <Modal isOpen={true}
            backdrop='blur'
            radius="lg"
            hideCloseButton={true}
            // onOpenChange={onOpenChange}
            isDismissable={false}
            className='bg-[#1B1A2D] rounded-lg w-10/12 md:w-1/2 lg:w-1/3'>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                            <ModalBody>
                                <div className="flex flex-col items-center justify-between">
                                    <Image
                                        src={imageSrc}
                                        alt="result icon"
                                        width={50}
                                        height={50}
                                        quality={100}
                                        className='w-24 h-24 lg:w-32 lg:h-32'
                                    />
                                    <p className={`flex ${textColor} lg:text-6xl text-3xl mt-3`}>{resultmssg}</p>
                                    {result === "win" && <Confetti {...confettiConfig} />}
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <div className='flex w-full justify-center'>
                                    <button className="btn btn-xs md:btn-sm btn-info" onClick={handleHomeClick}>Back home</button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
}
