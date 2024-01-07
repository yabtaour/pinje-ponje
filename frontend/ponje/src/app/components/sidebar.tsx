'use client';

import { useRouter } from 'next/navigation';
import { useState } from "react";



export function Collapse({ collapsed, setCollapsed }: any) {
    return (
        <div className=' '>
            {
                collapsed ? (

                    <>
                        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M19 12L31 24L19 36" />
                        </svg>
                    </>) : (<>
                        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M31 36L19 24L31 12" />
                        </svg>
                    </>)
            }
        </div>
    )
}


export default function SideBar(Props: any) {
    const router = useRouter();
    const { collapsed, toggleSidebar } = Props;

    const menuItems = [
        {
            id: '/profile', icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#3574FF" strokeWidth="2">
                    <path strokeLinejoin="round" d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" />
                    <circle cx="12" cy="7" r="3" />
                </g>
            </svg>, text: 'Profile'
        },
        { id: '/ranking', icon: <path fill="#3574FF" fillRule="evenodd" d="M12 3.034c-.058.101-.123.217-.199.354l-.098.176l-.023.04c-.078.144-.208.382-.425.547c-.221.168-.488.226-.643.26l-.044.009l-.19.043c-.176.04-.319.072-.44.103c.079.097.182.219.316.376l.13.152l.03.034c.108.125.282.325.363.585c.08.256.052.52.035.686a3.903 3.903 0 0 0-.005.047l-.02.203a35.76 35.76 0 0 0-.042.46c.105-.046.223-.1.364-.165l.179-.082l.04-.02c.144-.067.393-.185.672-.185s.528.118.672.186l.04.019l.179.082c.14.065.26.12.364.165a35.76 35.76 0 0 0-.042-.46l-.02-.203a3.903 3.903 0 0 0-.005-.047c-.017-.167-.045-.43.035-.686c.08-.26.255-.46.363-.585l.03-.034l.13-.152c.134-.157.237-.279.316-.376c-.121-.03-.264-.063-.44-.103l-.19-.043l-.044-.01c-.155-.033-.422-.091-.643-.26c-.217-.164-.347-.402-.425-.545l-.023-.041l-.098-.176c-.076-.137-.14-.253-.199-.354ZM11.014 1.8c.172-.225.484-.55.986-.55s.814.325.986.55c.165.214.33.511.5.816l.023.041l.098.177l.057.1l.099.023l.19.043l.048.01c.327.075.653.148.903.247c.276.109.65.32.795.785c.142.455-.037.841-.193 1.09c-.145.23-.365.486-.59.749l-.03.035l-.13.153l-.082.097c.002.036.007.078.012.135l.02.203l.004.046c.034.352.067.692.055.964c-.012.286-.08.718-.468 1.011c-.4.304-.84.238-1.12.157c-.258-.073-.563-.214-.87-.355l-.043-.02l-.18-.083L12 8.185l-.085.04l-.179.082l-.044.02c-.306.141-.61.282-.869.355c-.28.08-.72.147-1.12-.157c-.387-.293-.456-.725-.468-1.01c-.012-.273.02-.613.055-.965l.004-.046l.02-.203l.013-.135a9.85 9.85 0 0 0-.083-.097l-.13-.153l-.03-.035c-.225-.263-.445-.52-.59-.75c-.156-.248-.335-.634-.193-1.09c.144-.463.519-.675.795-.784c.25-.099.576-.172.903-.246l.047-.01l.191-.044l.1-.023l.056-.1l.098-.177l.023-.041c.17-.305.335-.602.5-.816Zm-.063 7.45h2.098c.665 0 1.238 0 1.697.062c.492.066.963.215 1.345.597s.531.853.597 1.345c.062.459.062 1.032.062 1.697v2.466c.164-.05.333-.082.504-.105c.459-.062 1.032-.062 1.697-.062h.098c.665 0 1.238 0 1.697.062c.492.066.963.215 1.345.597s.531.853.597 1.345c.062.459.062 1.032.062 1.697V22a.75.75 0 0 1-1.5 0v-3c0-.728-.002-1.2-.048-1.546c-.044-.325-.115-.427-.172-.484c-.057-.057-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048c-.728 0-1.2.002-1.546.048c-.325.044-.427.115-.484.172c-.057.057-.128.159-.172.484c-.046.347-.048.818-.048 1.546v3a.75.75 0 0 1-1.5 0v-9c0-.728-.002-1.2-.048-1.546c-.044-.325-.115-.427-.172-.484c-.057-.057-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048h-2c-.728 0-1.2.002-1.546.048c-.325.044-.427.115-.484.172c-.057.057-.128.159-.172.484c-.046.347-.048.818-.048 1.546v9a.75.75 0 0 1-1.5 0c0-.728-.002-1.2-.048-1.546c-.044-.325-.115-.427-.172-.484c-.057-.057-.159-.128-.484-.172c-.347-.046-.818-.048-1.546-.048c-.728 0-1.2.002-1.546.048c-.325.044-.427.115-.484.172c-.057.057-.128.159-.172.484c-.046.347-.048.818-.048 1.546a.75.75 0 0 1-1.5 0v-.05c0-.664 0-1.237.062-1.696c.066-.492.215-.963.597-1.345s.854-.531 1.345-.597c.459-.062 1.032-.062 1.697-.062h.098c.665 0 1.238 0 1.697.062c.171.023.34.056.504.105v-5.466c0-.665 0-1.238.062-1.697c.066-.492.215-.963.597-1.345s.854-.531 1.345-.597c.459-.062 1.032-.062 1.697-.062Z" clipRule="evenodd" />, text: 'Ranking' },
        { id: '/chat', icon: <path fill="#3574FF" d="M10 0C4.547 0 0 3.75 0 8.5c0 2.43 1.33 4.548 3.219 6.094a4.778 4.778 0 0 1-.969 2.25a14.4 14.4 0 0 1-.656.781a2.507 2.507 0 0 0-.313.406c-.057.093-.146.197-.187.407c-.042.209.015.553.187.812l.125.219l.25.125c.875.437 1.82.36 2.688.125c.867-.236 1.701-.64 2.5-1.063c.798-.422 1.557-.864 2.156-1.187c.084-.045.138-.056.219-.094C10.796 19.543 13.684 21 16.906 21c.031.004.06 0 .094 0c1.3 0 5.5 4.294 8 2.594c.1-.399-2.198-1.4-2.313-4.375c1.957-1.383 3.22-3.44 3.22-5.719c0-3.372-2.676-6.158-6.25-7.156C18.526 2.664 14.594 0 10 0zm0 2c4.547 0 8 3.05 8 6.5S14.547 15 10 15c-.812 0-1.278.332-1.938.688c-.66.355-1.417.796-2.156 1.187c-.64.338-1.25.598-1.812.781c.547-.79 1.118-1.829 1.218-3.281l.032-.563l-.469-.343C3.093 12.22 2 10.423 2 8.5C2 5.05 5.453 2 10 2z" />, text: 'Chat' },
        {
            id: '/pong', icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <g fill="none" stroke="#3574FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M12.718 20.713a7.64 7.64 0 0 1-7.48-12.755l.72-.72a7.643 7.643 0 0 1 9.105-1.283L17.45 3.61a2.08 2.08 0 0 1 3.057 2.815l-.116.126l-2.346 2.387a7.644 7.644 0 0 1-1.052 8.864" />
                    <path d="M11 18a3 3 0 1 0 6 0a3 3 0 1 0-6 0M9.3 5.3l9.4 9.4" />
                </g>
            </svg>, text: 'Play'
        }
    ];

    const [activePage, setActivePage] = useState('home');

    const handleMenuItemClick = (id: string) => {
        setActivePage(id);
        router.push(id);
    };

    return (

        <div className=" bg-[#151424] fixed flex flex-col justify-center  overflow-y-auto px-2 rounded-full my-5 h-[90vh]  py-4">
            <ul className="space-y-2 font-medium text-lg">
                {menuItems.map((item) => (
                    <li key={item.id}>
                        <a
                            href="#"
                            className={`flex my-10  items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-blue-900 dark:hover:bg-blue-900 group ${activePage === item.id ? 'bg-blue-900' : ''}`}
                            onClick={() => handleMenuItemClick(item.id)}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                {item.icon}
                            </svg>
                            <span className={`text-[#fff] flex-1 ml-3 whitespace-nowrap ${collapsed ? 'hidden' : 'block'}`}>
                                {item.text}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}