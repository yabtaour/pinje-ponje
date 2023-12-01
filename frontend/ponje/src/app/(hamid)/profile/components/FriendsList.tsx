"use client";

import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from "@nextui-org/react";
import React, { useState } from "react";


export const users = [
    {
        id: "1",
        name: "Tony Reichert",
        role: "CEO",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "2",
        name: "Zoey Lang",
        role: "Technical Lead",
        status: "Paused",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "3",
        name: "Jane Fisher",
        role: "Senior Developer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "4",
        name: "William Howard",
        role: "Community Manager",
        status: "Vacation",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "5",
        name: "Emily Collins",
        role: "Marketing Manager",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "6",
        name: "Brian Kim",
        role: "Product Manager",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "7",
        name: "Laura Thompson",
        role: "UX Designer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "8",
        name: "Michael Stevens",
        role: "Data Analyst",
        status: "Paused",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "9",
        name: "Sophia Nguyen",
        role: "Quality Assurance",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "10",
        name: "James Wilson",
        role: "Front-end Developer",
        status: "Vacation",
        avatar: " "
    },
    {
        id: "11",
        name: "Ava Johnson",
        role: "Back-end Developer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "12",
        name: "Isabella Smith",
        role: "Graphic Designer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "13",
        name: "Oliver Brown",
        role: "Content Writer",
        status: "Paused",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "14",
        name: "Lucas Jones",
        role: "Project Manager",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "15",
        name: "Grace Davis",
        role: "HR Manager",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "16",
        name: "Elijah Garcia",
        role: "Network Administrator",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "17",
        name: "Emma Martinez",
        role: "Accountant",
        status: "Vacation",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "18",
        name: "Benjamin Lee",
        role: "Operations Manager",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "19",
        name: "Mia Hernandez",
        role: "Sales Manager",
        status: "Paused",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "20",
        name: "Daniel Lewis",
        role: "DevOps Engineer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "21",
        name: "Amelia Clark",
        role: "Social Media Specialist",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "22",
        name: "Jackson Walker",
        role: "Customer Support",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "23",
        name: "Henry Hall",
        role: "Security Analyst",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "24",
        name: "Charlotte Young",
        role: "PR Specialist",
        status: "Paused",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
    {
        id: "25",
        name: "Liam King",
        role: "Mobile App Developer",
        status: "Active",
        avatar: "https://i1.rgstatic.net/ii/profile.image/11431281112723810-1673524482454_Q512/Hamid-Ouaissa.jpg",
    },
];


export default function FriendsList() {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };


    const [page, setPage] = React.useState(1);
    const rowsPerPage = 4;
    //? :the users.length should be the count of the users in the backend
    const pages = Math.ceil(users.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        // TODO : replace the slice with a query to the backend (start=> skip , end=> take)
        return users.slice(start, end);
    }, [page, users]);





    const renderUser = React.useCallback((user: any, columnKey: any) => {

        const cellValue = user[columnKey];

        return (
            <div>
                <button style={{
                    color: "#77DFF8",
                }} className=" hover:bg-[#333153] p-1 rounded-lg w-full  flex justify-start">
                    <User
                        avatarProps={{ radius: "lg", src: user.avatar }}
                        description={user.email}
                        name={cellValue}
                    >
                        {user.email}
                    </User>
                </button>
            </div>
        )
    }, []);


    return (
        <div className="w-96  m-10 bg-[#1B1A2D] rounded-sm">
            <header className="flex flex-row px-5 py-4 border-b border-[#464671] relative">
                <h2 className="font-regular text-2xl text-[#4E40F4] pr-3"> Friends </h2>
                <div className="flex items-center">
                    <div className="p-2 w-6 h-6 rounded-full border border-[#CECBFB] text-white flex items-center justify-center mr-2">
                        {users.length}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M256 144a64 64 0 1 0-64-64a64.072 64.072 0 0 0 64 64Zm0-96a32 32 0 1 1-32 32a32.036 32.036 0 0 1 32-32Zm0 320a64 64 0 1 0 64 64a64.072 64.072 0 0 0-64-64Zm0 96a32 32 0 1 1 32-32a32.036 32.036 0 0 1-32 32Zm0-272a64 64 0 1 0 64 64a64.072 64.072 0 0 0-64-64Zm0 96a32 32 0 1 1 32-32a32.036 32.036 0 0 1-32 32Z" />
                    </svg>
                </div>
            </header>
            <div className="p-3 w-full">
                <div className="overflow-x-auto">
                    <Table
                        style={{
                            padding: "0px",
                            color: "#fff",
                        }}
                        hideHeader
                        aria-label="Example table with client side pagination"
                        bottomContent={
                            <div className="flex w-full justify-center">
                                <Pagination
                                    isCompact
                                    showControls
                                    showShadow
                                    color='primary'
                                    page={page}
                                    total={pages}
                                    onChange={(page) => setPage(page)}
                                    style={{
                                        padding: "0px",
                                        color: "#8C8CDA",
                                    }}
                                />
                            </div>
                        }
                        classNames={{
                            wrapper: "min-h-[222px]",
                        }}
                    >
                        <TableHeader>
                            <TableColumn className="#4E40F4" key="name"> </TableColumn>
                        </TableHeader>
                        <TableBody items={items}>
                            {(item) => (
                                <TableRow key={item.name}>
                                    {(columnKey) => <TableCell>{renderUser(item, columnKey)}</TableCell>}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                </div>
            </div>
        </div>
    );
};

