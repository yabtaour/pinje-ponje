'use client';
import Loader from '@/app/components/loader';
import { useAppSelector } from '@/app/globalRedux/store';

import axios from '@/app/utils/axios';
import { User as NextUIUser, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';


import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';

const columns = [
  { name: "User", uid: "user" },
  { name: "XP", uid: "xp" },
  { name: "Rank", uid: "rank" },
  { name: "Profile", uid: "profile" },

]

export const Podium = ({ users }: { users: DisplayedInfo[] }) => {
  const rankedUsers = users.slice().sort((a, b) => b.ex - a.ex);

  if (rankedUsers.length >= 2) {
    const temp = rankedUsers[0];
    rankedUsers[0] = rankedUsers[1];
    rankedUsers[1] = temp;
  }



  const getImagedimensions = (user: any) => {
    var sizeOf = require('image-size');
    var dimensions = sizeOf(user?.avatar);
    console.log(dimensions.width, dimensions.height);
    return dimensions;
  };

  return (
    <div className="flex flex-row mt-16">
      {rankedUsers.map((user, index) => (
        <div key={user.id}>
          <div className={`relative max-w-[150px] mx-auto min-w-0 break-words bg-[#1B1A2D] w-full mb-6 shadow-lg rounded-xl mt-${index === 1 ? "28" : "20"}`}>
            <div className="px-6">
              <div className="flex flex-wrap justify-center">
                <div className="w-full flex justify-center">
                  <div className="relative mb-[-3rem]">
                    <div className="avatar">
                      <div className="w-24 rounded-full">
                        <Image
                          src={user.avatar}
                          alt="user image"
                          fill
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
                <p className={`text-3xl text-white font-bold leading-normal mb-1`}>#{index === 0 ? 2 : index === 1 ? 1 : 3}</p>
                <p className={`text-lg text-white font-regular leading-normal mb-1`}>{user.username}</p>
                <p className={`text-xl font-bold leading-normal mb-1`} style={{ color: index === 1 ? "#f4e240" : index === 2 ? "#d18c3d" : "#c5c5c2" }}>{user.ex}</p>
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


  const accessToken = useAppSelector((state) => state.authReducer.value.token);

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
        return <p className="text-white text-regular">{user?.ex}</p>;
      case "Rank":
        return <p>{"IMAGE RANK"}</p>;
      case "profile":
        return (
          <Link href={`/profile/${user.id}`}>
            <h1 className="text-indigo-600">
              <span className="text-sm">Visit Profile</span>
            </h1>
          </Link>
        );
      default:
        return cellValue;
    }
  }, []);


  return (
    <div className="p-0 m-0 w-2/3 flex " >
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
          ex: user?.experience,
          rank: user?.rank,
          avatar: user?.profile?.avatar
        }));

        setUsers(transformedUsers);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers()

  }, [users]);


  return (
    <>
      {
        users.length === 0 ? (
          <div className='min-h-screen'>
            <Loader />;
          </div>
        ) : (
          <>
            <div className='w-full  flex justify-center bg-[#151424] '>
              {/* users is empty for now so am using an array of fake users */}
              <Podium users={users.slice(0, 3)} />
              {/* <Podium users={fakeUsers} /> */}

            </div>

            <div className='bg-[#151424]  w-full flex justify-center'>
              <Leaderboard users={users.slice(3)} />
            </div>
          </>
        )
      }
    </>
  );
}