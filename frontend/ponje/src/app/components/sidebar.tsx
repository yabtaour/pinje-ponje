'use client';

import { Margarine } from "next/font/google";
import { useState } from "react";

export default function SideBar(Props: any) {

    const { collapsed, toggleSidebar } = Props;

    const [active, setActive] = useState('home');

    return (
        <div>
            <aside className="z-40  h-screen ">
                <div className=" h-full px-3 py-4 ">
                    <ul className="space-y-2 font-medium">
                        <li >
                            <a href="#" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 `}>
                                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#3574FF" d="M21 20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.489a1 1 0 0 1 .386-.79l8-6.222a1 1 0 0 1 1.228 0l8 6.222a1 1 0 0 1 .386.79v10.51Zm-2-1V9.978l-7-5.445l-7 5.445V19h14Z" />
                                </svg>
                                <span className='text-[#3574FF] flex-1 ml-3 whitespace-nowrap'
                                    style={
                                        collapsed ? { display: 'none' } : { display: 'block' }
                                    }
                                >Home</span>
                                <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-100 rounded-full dark:bg-gray-700 dark:text-gray-300"></span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <svg fill="#3574FF" stroke="#fff" strokeWidth="0">
                                        <path strokeLinecap="round" d="M16 22v-9c0-1.414 0-2.121-.44-2.56C15.122 10 14.415 10 13 10h-2c-1.414 0-2.121 0-2.56.44C8 10.878 8 11.585 8 13v9m0 0c0-1.414 0-2.121-.44-2.56C7.122 19 6.415 19 5 19c-1.414 0-2.121 0-2.56.44C2 19.878 2 20.585 2 22m20 0v-3c0-1.414 0-2.121-.44-2.56C21.122 16 20.415 16 19 16c-1.414 0-2.121 0-2.56.44C16 16.878 16 17.585 16 19v3">

                                        </path>
                                        <path d="M11.146 3.023C11.526 2.34 11.716 2 12 2c.284 0 .474.34.854 1.023l.098.176c.108.194.162.29.246.354c.085.064.19.088.4.135l.19.044c.738.167 1.107.25 1.195.532c.088.283-.164.577-.667 1.165l-.13.152c-.143.167-.215.25-.247.354c-.032.104-.021.215 0 .438l.02.203c.076.785.114 1.178-.115 1.352c-.23.175-.576.015-1.267-.303l-.178-.082c-.197-.09-.295-.136-.399-.136c-.104 0-.202.046-.399.136l-.178.082c-.691.318-1.037.478-1.267.303c-.23-.174-.191-.567-.115-1.352l.02-.203c.021-.223.032-.334 0-.438c-.032-.103-.104-.187-.247-.354l-.13-.152c-.503-.588-.755-.882-.667-1.165c.088-.282.457-.365 1.195-.532l.19-.044c.21-.047.315-.07.4-.135c.084-.064.138-.16.246-.354l.098-.176Z"></path>
                                    </svg>
                                </svg>
                                <span className=" text-[#3574FF] flex-1 ml-3 whitespace-nowrap"
                                    style={
                                        collapsed ? { display: 'none' } : { display: 'block' }
                                    }>Ranking</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#3574FF" d="M19 21q-.975 0-1.75-.563T16.175 19H11q-1.65 0-2.825-1.175T7 15q0-1.65 1.175-2.825T11 11h2q.825 0 1.413-.588T15 9q0-.825-.588-1.413T13 7H7.825q-.325.875-1.088 1.438T5 9q-1.25 0-2.125-.875T2 6q0-1.25.875-2.125T5 3q.975 0 1.738.563T7.824 5H13q1.65 0 2.825 1.175T17 9q0 1.65-1.175 2.825T13 13h-2q-.825 0-1.413.588T9 15q0 .825.588 1.413T11 17h5.175q.325-.875 1.088-1.438T19 15q1.25 0 2.125.875T22 18q0 1.25-.875 2.125T19 21ZM5 7q.425 0 .713-.288T6 6q0-.425-.288-.713T5 5q-.425 0-.713.288T4 6q0 .425.288.713T5 7Z"></path>
                                </svg>
                                <span className=" text-[#3574FF] flex-1 ml-3 whitespace-nowrap"
                                    style={
                                        collapsed ? { display: 'none' } : { display: 'block' }
                                    }>Career</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                <svg width="1em" height="1em" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
                                    <path fill="#3574FF" d="M10 0C4.547 0 0 3.75 0 8.5c0 2.43 1.33 4.548 3.219 6.094a4.778 4.778 0 0 1-.969 2.25a14.4 14.4 0 0 1-.656.781a2.507 2.507 0 0 0-.313.406c-.057.093-.146.197-.187.407c-.042.209.015.553.187.812l.125.219l.25.125c.875.437 1.82.36 2.688.125c.867-.236 1.701-.64 2.5-1.063c.798-.422 1.557-.864 2.156-1.187c.084-.045.138-.056.219-.094C10.796 19.543 13.684 21 16.906 21c.031.004.06 0 .094 0c1.3 0 5.5 4.294 8 2.594c.1-.399-2.198-1.4-2.313-4.375c1.957-1.383 3.22-3.44 3.22-5.719c0-3.372-2.676-6.158-6.25-7.156C18.526 2.664 14.594 0 10 0zm0 2c4.547 0 8 3.05 8 6.5S14.547 15 10 15c-.812 0-1.278.332-1.938.688c-.66.355-1.417.796-2.156 1.187c-.64.338-1.25.598-1.812.781c.547-.79 1.118-1.829 1.218-3.281l.032-.563l-.469-.343C3.093 12.22 2 10.423 2 8.5C2 5.05 5.453 2 10 2z"></path>
                                </svg>
                                <span className=" text-[#3574FF] flex-1 ml-3 whitespace-nowrap"
                                    style={
                                        collapsed ? { display: 'none' } : { display: 'block' }
                                    }>Chat</span>
                            </a>
                        </li>

                        <li className="relative" style={{
                            paddingTop: '39rem',
                        }} >
                            <button onClick={toggleSidebar} className='flex items-center justify-center w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:outline-none'>
                                <span className="flex items-center">
                                    <svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                        <path fill="#3574FF" fillRule="evenodd" d="M0 12.25a.75.75 0 0 0 1.5 0v-8.5a.75.75 0 0 0-1.5 0v8.5Zm7.841-8.03a.75.75 0 0 1 0 1.06l-1.97 1.97h9.379a.75.75 0 0 1 0 1.5H5.871l1.97 1.97a.75.75 0 1 1-1.06 1.06L3.53 8.53L3 8l.53-.53l3.25-3.25a.75.75 0 0 1 1.061 0Z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
            </aside >

        </div >
    )
}



// export default function SideBar() {
//     const [collapsed, setCollapsed] = useState(false);

//     const toggleCollapse = () => {
//         setCollapsed(!collapsed);
//     };

//     return (
//         <aside className={`z-40 w-${collapsed ? '16' : '64'} h-screen transition-all duration-300 ease-in-out`}>
//             <div className="bg-[#1B1839] h-full px-3 py-4 ">
//                 <ul className="space-y-2 font-medium">
//                     <li>
//                         <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
//                             <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 {/* Home icon */}
//                             </svg>
//                             {!collapsed && <span className="flex-1 ml-3 whitespace-nowrap">Home</span>}
//                         </a>
//                     </li>
//                     <li>
//                         <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                             <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 {/* Ranking icon */}
//                             </svg>
//                             {!collapsed && <span className="flex-1 ml-3 whitespace-nowrap">Ranking</span>}
//                         </a>
//                     </li>
//                     <li>
//                         <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                             <svg width="1em" height="1em" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                 {/* Career icon */}
//                             </svg>
//                             {!collapsed && <span className="flex-1 ml-3 whitespace-nowrap">Career</span>}
//                         </a>
//                     </li>
//                     <li>
//                         <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
//                             <svg width="1em" height="1em" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg">
//                                 {/* Chat icon */}
//                             </svg>
//                             {!collapsed && <span className="flex-1 ml-3 whitespace-nowrap">Chat</span>}
//                             {!collapsed && (
//                                 <span className="inline-flex items-center justify-center w-3 h-3 p-3 ml-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">
//                                     3
//                                 </span>
//                             )}
//                         </a>
//                     </li>
//                     {!collapsed && (
//                         <li className="relative">
//                             <button className="flex items-center justify-between w-full p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:outline-none">
//                                 <span className="flex items-center">
//                                     <svg width="1em" height="1em" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
//                                         {/* Button icon */}
//                                     </svg>
//                                 </span>
//                             </button>
//                         </li>
//                     )}
//                 </ul>
//             </div>
//             <div className="absolute bottom-0 left-0 right-0">
//                 <button
//                     className="p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group focus:outline-none"
//                     onClick={toggleCollapse}
//                 >
//                     {!collapsed ? 'Collapse' : 'Expand'}
//                 </button>
//             </div>
//         </aside>
//     );
// }