'use client';
import Loader from '@/app/components/loader';

import axios from '@/app/utils/axios';
import { User as NextUIUser, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';


import { useToast } from "@chakra-ui/react";
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';



const columns = [
  { name: "User", uid: "user" },
  { name: "XP", uid: "xp" },
  { name: "Rank", uid: "rank" },
  { name: "Profile", uid: "profile" },

]
export const Podium = ({ users }: { users: DisplayedInfo[] }) => {
  const rankedUsers = users;
  const updatedUsers = rankedUsers.slice();
  updatedUsers.splice(1, 0, updatedUsers.splice(0, 1)[0]);

  return (
    <div className="flex flex-row mt-16 space-x-6">
      {updatedUsers.map((user, index) => (
        <div key={user.id}>
          <div className={`relativemx-auto min-w-0 break-words bg-[#1B1A2D] w-fit lg:w-fit md:w-full mb-6 shadow-lg rounded-xl mt-${index === 1 ? "28" : "20"}`}>
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className=" flex justify-center">
                  <div className="relative mb-[-3rem]">
                    <div className="avatar">
                      <div className="w-16 lg:w-24 md:w-32 rounded-full">
                        <Image
                          src={user?.avatar ?? '/placeholderuser.jpeg'}
                          alt="user image"
                          fill
                          sizes='(max-width: 768px) 100vw,
                          (max-width: 1200px) 50vw,
                          33vw'
                          style={{ objectFit: "cover" }}
                          className='rounded-full'
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-center mt-9">
                  <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                  </div>
                </div>
              </div>
              <div className="text-center ">
                <p className={`text-lg lg:text-3xl md:text-3xl text-white font-bold leading-normal mb-1`}>#{index === 0 ? 2 : index === 1 ? 1 : 3}</p>
                <p className={`text-sm text-[#77DFF8] font-semibold leading-normal mb-1`}>{user.username}</p>
                <p className={`text-lg lg:text-xl font-bold leading-normal mb-1`} style={{ color: index === 1 ? "#f4e240" : index === 2 ? "#d18c3d" : "#c5c5c2" }}>{user.ex}</p>
              </div>
              <div className="mt-2 py-2 text-center">
                <div className="flex flex-wrap justify-center">
                  <Link href={`/profile/${user.id}`}>
                    <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
                  </Link>
                </div>
                <p className="text-xs text-[#9e9cc8] font-regular leading-normal mb-1">{`@${user.username}`}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}




export type DisplayedInfo = {
  id: number,
  username: string,
  ex: number,
  rank: string,
  avatar: string,
}



export const Leaderboard = ({ users }: { users: DisplayedInfo[] }) => {
  const [page, setPage] = React.useState(1);



  const rowsPerPage = 20;

  const pages = Math.ceil(users.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return users.slice(start, end);
  }, [page, users]);





  const renderCell = React.useCallback((user: any, columnKey: any) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "user":
        return (
          <button className="text-[#77DFF8] p-1 rounded-lg space-x-6">
            <NextUIUser
              avatarProps={{ radius: "full", src: user.avatar }}
              description={user.username}
              name={cellValue}
            >
            </NextUIUser>
          </button>
        );
      case "xp":
        return <p className="text-white text-regular text-sm md:text-base lg:text-lg">{user?.ex}</p>;
      case "Rank":
        return <p className='text-xs md:text-base lg:text-lg'>{"IMAGE RANK"}</p>;
      case "profile":
        return (
          <Link href={`/profile/${user.id}`}>
            <h1 className="text-indigo-600">
              <span className="text-xs md:text-sm lg:text-base">Visit Profile</span>
            </h1>
          </Link>
        );
      default:
        return cellValue;
    }
  }, []);


  return (
    <div className="p-0 m-0 w-full lg:w-2/3 flex " >
      {
        users.length === 0 ? (
          <div className='min-h-screen'>
            <Loader />;
          </div>
        ) : (
          <>
            <Table
              style={{
                padding: "0px",
                color: "#fff",
              }}
              isCompact isStriped
              aria-label="Example table with client side pagination"
              bottomContent={
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    style={{
                      color: "#fff",
                    }}
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              }
              classNames={{
                wrapper: "min-h-[222px]",
              }}
            >
              <TableHeader columns={columns}>
                {(column) => (
                  <TableColumn style={{
                    backgroundColor: "#333153"
                  }} key={column.uid} align={"center"}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody className="bg-[#000] " items={items}>
                {(item) => (
                  <TableRow key={item.id}>
                    {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                  </TableRow>
                )}
              </TableBody>
            </Table>

          </>
        )
      }
    </div>
  );
}

export default function RankPage() {

  const [users, setUsers] = React.useState([] as DisplayedInfo[]);
  const toast = useToast();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isLoading && users.length === 0) {
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [isLoading, users.length]);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users', {
          headers: {
            'Authorization': `${localStorage.getItem('access_token')}`
          }
        });
        const transformedUsers = res.data.map((user: any) => ({
          id: user?.id,
          username: user?.username,
          ex: user?.experience ?? 0,
          rank: user?.rank,
          avatar: user?.profile?.avatar
        }));

        setLoading(false);
        setUsers(transformedUsers);
        return res.data;
      } catch (err) {
        toast({
          title: 'Error',
          description: "error while getting users",
          status: 'error',
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.log(err);
      }
    };

    fetchUsers()

  }, []);



  console.log("users: ", users);
  return (
    <div className=''>
      {
        isLoading && users.length === 0 ? (
          <div className='min-h-screen'>
            <Loader />;
          </div>
        ) : !isLoading && users.length === 0 ?
          (
            <div className='text-gray-500 min-h-screen flex flex-col items-center'>
              <Image
                className='my-10'
                width={300}
                height={300}
                alt="NextUI hero Image"
                src="noData.svg"
              />
              <h1>NO Users UWU</h1>
            </div>
          ) : (
            <>
              <div className='w-full min-[320px]:text-center flex justify-center bg-[#151424] '>
                <Podium users={users.filter(user => user.ex !== undefined && user.ex !== null).slice().sort((a, b) => (b.ex || 0) - (a.ex || 0)).slice(0, 3)} />
              </div>

              <div className='bg-[#151424]  w-full flex justify-center'>
                <Leaderboard users={users.filter(user => user.ex !== undefined && user.ex !== null).slice().sort((a, b) => (b.ex || 0) - (a.ex || 0)).slice(3)} />
              </div>
            </>
          )
      }
    </div>
  );

}