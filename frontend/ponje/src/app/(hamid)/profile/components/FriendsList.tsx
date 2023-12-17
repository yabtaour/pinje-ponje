"use client";

import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User as NextUser } from "@nextui-org/react";
import React, { useState } from "react";
import { User } from '../../../../app/types/user'

export default function FriendsList({ users }: { users: User[] }) {
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
                    <NextUser
                        avatarProps={{ radius: "lg", src: user.profile.avatar }}
                        description={user.username}
                        name={cellValue}
                    >
                        {user.email}
                    </NextUser>
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
                <div className="overflow-x-auto flex flex-col items-center">
                    {!users.length && (
                        <div className="text-center text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" width="246" height="244" viewBox="0 0 146 144" fill="none" className="w-40 h-40 lg:w-60 lg:h-60">
                                <path fillRule="evenodd" clipRule="evenodd" d="M39.125 102.5C39.125 99.8077 41.3076 97.625 44 97.625H70C72.6923 97.625 74.875 99.8077 74.875 102.5C74.875 105.192 72.6923 107.375 70 107.375H44C41.3076 107.375 39.125 105.192 39.125 102.5ZM100.875 37.5C100.875 34.8076 98.6923 32.625 96 32.625H70C67.3077 32.625 65.125 34.8076 65.125 37.5C65.125 40.1924 67.3077 42.375 70 42.375H96C98.6923 42.375 100.875 40.1924 100.875 37.5ZM56.8029 56.8029C58.7069 54.8991 61.7931 54.8991 63.697 56.8029L83.197 76.303C85.1008 78.2069 85.1008 81.2931 83.197 83.197C81.2931 85.1008 78.2069 85.1008 76.303 83.197L56.8029 63.697C54.8991 61.7931 54.8991 58.7069 56.8029 56.8029Z" fill="#8B98A6" />
                                <path d="M37.5 0.125C16.8583 0.125 0.125 16.8583 0.125 37.5C0.125 58.1414 16.8583 74.875 37.5 74.875C58.1414 74.875 74.875 58.1414 74.875 37.5C74.875 16.8583 58.1414 0.125 37.5 0.125ZM102.5 65.125C81.8586 65.125 65.125 81.8586 65.125 102.5C65.125 123.141 81.8586 139.875 102.5 139.875C123.141 139.875 139.875 123.141 139.875 102.5C139.875 81.8586 123.141 65.125 102.5 65.125Z" fill="#6C5FFF" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M67.2193 60.1674V59.0514C67.2193 58.5626 67.1459 58.0764 67.0009 57.6097C63.1055 45.0254 51.3792 35.875 37.5029 35.875C23.6267 35.875 11.9003 45.0254 8.0047 57.6097C7.86014 58.0764 7.78662 58.5626 7.78662 59.0514V60.1746C14.616 69.1108 25.3848 74.875 37.5 74.875C49.6187 74.875 60.3904 69.1075 67.2193 60.1674ZM132.219 125.167V124.051C132.219 123.563 132.146 123.076 132.001 122.61C128.105 110.026 116.379 100.875 102.503 100.875C88.6264 100.875 76.9004 110.026 73.005 122.61C72.86 123.076 72.7866 123.563 72.7866 124.051V125.175C79.6161 134.111 90.3847 139.875 102.5 139.875C114.619 139.875 125.39 134.108 132.219 125.167Z" fill="#6DCAF8" />
                                <path d="M37.5 16.375C29.4228 16.375 22.875 22.9228 22.875 31C22.875 39.0772 29.4228 45.625 37.5 45.625C45.5772 45.625 52.125 39.0772 52.125 31C52.125 22.9228 45.5772 16.375 37.5 16.375ZM102.5 81.375C94.4231 81.375 87.875 87.9231 87.875 96C87.875 104.077 94.4231 110.625 102.5 110.625C110.577 110.625 117.125 104.077 117.125 96C117.125 87.9231 110.577 81.375 102.5 81.375Z" fill="#6DCAF8" />
                                <path d="M31 84.625C21.1279 84.625 13.125 92.6278 13.125 102.5C13.125 112.372 21.1279 120.375 31 120.375C40.8721 120.375 48.875 112.372 48.875 102.5C48.875 92.6278 40.8721 84.625 31 84.625ZM109 19.625C118.872 19.625 126.875 27.6279 126.875 37.5C126.875 47.3721 118.872 55.375 109 55.375C99.1278 55.375 91.125 47.3721 91.125 37.5C91.125 27.6279 99.1278 19.625 109 19.625Z" fill="#6C5FFF" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M37.5 0.125V74.875C16.8583 74.875 0.125 58.1414 0.125 37.5C0.125 16.8583 16.8583 0.125 37.5 0.125ZM102.5 65.125V139.875C81.8586 139.875 65.125 123.141 65.125 102.5C65.125 81.8586 81.8586 65.125 102.5 65.125Z" fill="#4E40F4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M37.4998 35.875L37.5 74.875C25.8891 74.875 15.5145 69.5808 8.65942 61.2738M102.5 100.875L102.5 139.875C90.8891 139.875 80.5144 134.581 73.6595 126.274" fill="#77DFF8" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M37.5 16.375V45.625C29.4228 45.625 22.875 39.0772 22.875 31C22.875 22.9228 29.4228 16.375 37.5 16.375ZM102.5 81.375V110.625C94.4231 110.625 87.875 104.077 87.875 96C87.875 87.9231 94.4231 81.375 102.5 81.375Z" fill="#77DFF8" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M109 19.625C99.1278 19.625 91.125 27.6279 91.125 37.5C91.125 47.3721 99.1278 55.375 109 55.375V19.625ZM31 84.625C21.1279 84.625 13.125 92.6278 13.125 102.5C13.125 112.372 21.1279 120.375 31 120.375V84.625Z" fill="#4E40F4" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M102.5 139.625C123.004 139.625 139.625 123.004 139.625 102.5C139.625 81.9965 123.004 65.375 102.5 65.375C81.9965 65.375 65.375 81.9965 65.375 102.5C65.375 123.004 81.9965 139.625 102.5 139.625ZM102.5 143.75C125.282 143.75 143.75 125.282 143.75 102.5C143.75 79.7182 125.282 61.25 102.5 61.25C79.7182 61.25 61.25 79.7182 61.25 102.5C61.25 125.282 79.7182 143.75 102.5 143.75Z" fill="#2F296E" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M86.4575 118.544C85.6518 117.739 85.6518 116.433 86.4575 115.627L115.626 86.459C116.431 85.6536 117.737 85.6536 118.542 86.459C119.348 87.2644 119.348 88.5704 118.542 89.3758L89.3742 118.544C88.5686 119.35 87.2629 119.35 86.4575 118.544Z" fill="#2F296E" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M86.4575 86.459C87.2631 85.6536 88.5688 85.6536 89.3745 86.459L118.543 115.627C119.348 116.433 119.348 117.739 118.543 118.544C117.737 119.35 116.431 119.35 115.626 118.544L86.4575 89.3758C85.6521 88.5704 85.6521 87.2644 86.4575 86.459Z" fill="#2F296E" />
                                <path d="M122 58L106 68L110 58C103.635 58 97.5303 55.4714 93.0294 50.9706C88.5286 46.4697 86 40.3652 86 34V32C86 25.6348 88.5286 19.5303 93.0294 15.0294C97.5303 10.5286 103.635 8 110 8H122C128.365 8 134.47 10.5286 138.971 15.0294C143.471 19.5303 146 25.6348 146 32V34C146 40.3652 143.471 46.4697 138.971 50.9706C134.47 55.4714 128.365 58 122 58Z" fill="#77DFF8" />
                                <path d="M125 40V42C124.999 47.2983 123.244 52.4473 120.01 56.6439C116.775 60.8405 112.243 63.8489 107.12 65.2L110 58C103.635 58 97.5303 55.4714 93.0294 50.9706C88.5286 46.4697 86 40.3652 86 34V32C85.992 26.0935 88.1722 20.3934 92.12 16H101C107.365 16 113.47 18.5286 117.971 23.0294C122.471 27.5303 125 33.6348 125 40Z" fill="#6DCAF8" />
                                <path d="M109 31C108.735 31 108.48 30.8946 108.293 30.7071C108.105 30.5196 108 30.2652 108 30C108 28.6739 107.473 27.4021 106.536 26.4645C105.598 25.5268 104.326 25 103 25C101.674 25 100.402 25.5268 99.4645 26.4645C98.5268 27.4021 98 28.6739 98 30C98 30.2652 97.8946 30.5196 97.7071 30.7071C97.5196 30.8946 97.2652 31 97 31C96.7348 31 96.4804 30.8946 96.2929 30.7071C96.1054 30.5196 96 30.2652 96 30C96 28.1435 96.7375 26.363 98.0503 25.0503C99.363 23.7375 101.143 23 103 23C104.857 23 106.637 23.7375 107.95 25.0503C109.262 26.363 110 28.1435 110 30C110 30.2652 109.895 30.5196 109.707 30.7071C109.52 30.8946 109.265 31 109 31ZM135 31C134.735 31 134.48 30.8946 134.293 30.7071C134.105 30.5196 134 30.2652 134 30C134 28.6739 133.473 27.4021 132.536 26.4645C131.598 25.5268 130.326 25 129 25C127.674 25 126.402 25.5268 125.464 26.4645C124.527 27.4021 124 28.6739 124 30C124 30.2652 123.895 30.5196 123.707 30.7071C123.52 30.8946 123.265 31 123 31C122.735 31 122.48 30.8946 122.293 30.7071C122.105 30.5196 122 30.2652 122 30C122 28.1435 122.737 26.363 124.05 25.0503C125.363 23.7375 127.143 23 129 23C130.857 23 132.637 23.7375 133.95 25.0503C135.263 26.363 136 28.1435 136 30C136 30.2652 135.895 30.5196 135.707 30.7071C135.52 30.8946 135.265 31 135 31Z" fill="#6C5FFF" />
                                <path d="M131 49C130.735 49 130.48 48.8946 130.293 48.7071C130.105 48.5196 130 48.2652 130 48C130 43 123.72 39 116 39C108.28 39 102 43 102 48C102 48.2652 101.895 48.5196 101.707 48.7071C101.52 48.8946 101.265 49 101 49C100.735 49 100.48 48.8946 100.293 48.7071C100.105 48.5196 100 48.2652 100 48C100 41.93 107.18 37 116 37C124.82 37 132 41.93 132 48C132 48.2652 131.895 48.5196 131.707 48.7071C131.52 48.8946 131.265 49 131 49Z" fill="#6C5FFF" />
                            </svg>
                            <p className="mt-6 text-lg"> No friends found. </p>
                        </div>
                    )}

                    {users.length > 0 && (
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
                                    <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderUser(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </div>
            </div>
        </div>
    );
};

