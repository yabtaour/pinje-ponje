'use client'
import { useAppSelector } from '@/app/globalRedux/store';
import { Card } from '@nextui-org/react';
import Image from 'next/image';



export default function Dashboard() {

    const AuthState = useAppSelector((state) => state.authReducer.value)

    return (
        <div className="bg-[#151424] h-screen w-screen " style={{
            // paddingTop: '5rem',
            // paddingLeft: '16rem',
        }}>


            <Card
                isFooterBlurred
                radius="lg"
                className=" border-none transition-transform hover:scale-105 hover:shadow-lg hover:brightness-110"
                style={{
                    width: '40%',
                    filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    // glow: '0 0 20px #3574FF',
                }}
            >
                <Image
                    alt="Woman listing to music"
                    className="object-cover"
                    height={600}
                    src="/playNow.png"
                    width={600}
                />
            </Card>


        </div>
    );
}