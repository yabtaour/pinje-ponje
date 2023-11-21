'use client'
import { Modal, ModalContent, NextUIProvider } from "@nextui-org/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { HashLoader } from 'react-spinners';
export default function Loader() {

    const [isOpen, setIsOpen] = useState(true);
    const dispatch = useDispatch();


    return (
        <NextUIProvider>
            <Modal
                className=""
                isOpen={isOpen}
                backdrop="blur"

                radius="lg"
                classNames={{
                    closeButton: 'hidden',
                    base: "w-screen",
                    backdrop: "bg-gray-900/50",
                }}
            >
                <ModalContent className="flex flex-row justify-center align-middle">
                    <HashLoader size={100} color="#2F296E" />
                </ModalContent>
            </Modal>
        </NextUIProvider>
    )
}
