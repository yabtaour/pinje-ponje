"use client";
import React, { useState } from 'react';

const FriendsList = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="w-96 max-w-2xl mx-auto bg-[#1B1A2D] rounded-sm">
            <header className="px-5 py-4 border-b border-[#464671]">
                <h2 className="font-regular text-2xl text-[#4E40F4]"> Friends </h2>
            </header>
            <div className="p-3">
                <div className="overflow-x-auto">
                    <table className="table-auto w-full max-w-full">
                        <tbody className="text-sm divide-y divide-gray-100">
                            <tr>
                                <td className="p-2 whitespace-nowrap" style={{ width: '100px' }}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                                                <img className="rounded-full" src="https://raw.githubusercontent.com/cruip/vuejs-admin-dashboard-template/main/src/images/user-36-05.jpg" width="40" height="40" alt="Alex Shatov" />
                                            </div>
                                            <div>
                                                <div className="font-light text-secondary">
                                                    Alex Shatov
                                                </div>
                                                <div className="text-xs text-gray-400">Joined 20 days ago</div>
                                            </div>
                                        </div>
                                        <details className={`dropdown ${isOpen ? 'open' : ''}`}>
                                            <summary className="m-1 btn" onClick={toggleDropdown}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#4E40F4]" viewBox="0 0 4 20" fill="none">
                                                    <circle cx="2" cy="2" r="2" fill="#D9D9D9"/>
                                                    <path d="M4.00024 18C4.00024 19.1046 3.10481 20 2.00024 20C0.895675 20 0.000244141 19.1046 0.000244141 18C0.000244141 16.8954 0.895675 16 2.00024 16C3.10481 16 4.00024 16.8954 4.00024 18Z" fill="#D9D9D9"/>
                                                    <circle cx="2.00024" cy="10" r="2" fill="#D9D9D9"/>
                                                </svg>
                                            </summary>
                                            <ul className={`p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52 ${isOpen ? 'max-h-52' : 'max-h-[0]'}`}>
                                                <li><a>Item 1</a></li>
                                                <li><a>Item 2</a></li>
                                            </ul>
                                        </details>
                                    </div>
                                </td>
                            </tr>
                            {/* Add more users here */}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FriendsList;
