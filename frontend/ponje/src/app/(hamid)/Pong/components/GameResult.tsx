"use client";
import React, { useEffect } from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Confetti from 'react-confetti';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


export default function GameResult() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter();
    const [result, setResult] = useState("");

    const handleHomeClick = () => {
        router.push('/Pong');
    }
    useEffect(() => {
        // setResult("win");
        setResult("loss");
    }, []);

    const imageSrc = result === "win" ? "/win_icon.svg" : "/loss_icon.svg";
    const resultmssg = result === "win" ? "YOU WIN!" : "YOU LOST :(";
    const textColor = result === "win" ? "text-green-500" : "text-red-500";
   
    const confettiConfig = {
        width: 410,
        height: 300,
        recycle: false,
        numberOfPieces: 50,
        gravity: 0.5,
    };

    return (
        <>
            <Button onPress={onOpen}>Open Modal</Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className='bg-[#1B1A2D] rounded-lg w-10/12 md:w-1/2 lg:w-1/3'>
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
                            <button className="btn btn-xs md:btn-sm btn-outline md:btn-outline btn-error" onClick={onClose}>close</button>
                            <button className="btn btn-xs md:btn-sm btn-info" onClick={handleHomeClick}>Back home</button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
