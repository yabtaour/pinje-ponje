"use client";
import React from 'react';
import Image from 'next/image';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";


import { useEffect } from 'react';

export default function Rules() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Modal
        size="md"
        isOpen={isOpen}
        onClose={onClose}
        className='bg-[#1B1A2D] text-[#C6BCBC]'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#4E40F4]">Game rules and controls</ModalHeader>
              <ModalBody>
                <div className="badge badge-secondary badge-outline">Rules</div>
                <div className="flex items-center justify-between">
                  <p className="flex-1">
                    Move your paddle to hit the ball back and forth. Score when the ball passes your opponent's paddle. First to 11 points wins!
                  </p>
                  <Image
                    src="/pong.gif"
                    alt="pong gif"
                    width={200}
                    height={200}
                    quality={100}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className='flex-1'>
                    <div className="flex justify-center w-full">
                      <kbd className="kbd">▲</kbd>
                    </div>
                    <div className="flex justify-center w-full">
                      <kbd className="kbd">▼</kbd>
                    </div>
                  </div>
                  <p>arrows</p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
  //   useEffect(() => {
  //       const modal = document.getElementById('my_modal_1');    
  //       if (modal instanceof HTMLDialogElement) {
  //         modal.showModal();
  //       }
  //     }, []);
  // return (
  //   <dialog id="my_modal_1" className="modal">
  //     <div className="modal-box">
  //       <h3 className="font-bold text-lg">Hello!</h3>
  //       <p className="py-4">Press ESC key or click the button below to close</p>
  //       <div className="modal-action">
  //         <form method="dialog">
  //           <button className="btn">Close</button>
  //         </form>
  //       </div>
  //     </div>
  //   </dialog>
  // );
}
