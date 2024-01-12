'use client'
import { Modal, ModalContent, NextUIProvider } from "@nextui-org/react";
import { useState , useEffect } from "react";
import { useDispatch } from "react-redux";
import { HashLoader } from 'react-spinners';
export default function Loader() {

    const [isOpen, setIsOpen] = useState(true);
    const dispatch = useDispatch();
    const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

    return  (
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
            <ModalContent className="flex flex-row justify-center items-center">
              <HashLoader size={windowWidth > 600 ? 100 : 0} color="#2F296E" />
            </ModalContent>
          </Modal>
        </NextUIProvider>
      );
}
