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
  { name: "Games Won", uid: "games Won" },
  { name: "Rank", uid: "rank" },
  { name: "Profile", uid: "profile" },

]

export const Podium = ({ users }: { users: DisplayedInfo[] }) => {
  return (
    <div className="flex flex-row"  >
      <div>
        <div className="relative max-w-[150px] mx-auto  min-w-0 break-words bg-[#1B1A2D] w-full mb-6 shadow-lg rounded-xl mt-28">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  <Image
                    src="https://www.citedesartsparis.net/media/cia/188349-img_20200902_151505.jpg"
                    alt="Team member"
                    className="align-middle absolute -m-10 -ml-10 lg:-ml-9 max-w-[70px] border-2 border-[#c5c5c2] rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
              </div>
              <div className="w-full text-center mt-9">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                </div>
              </div>
            </div>
            <div className="text-center ">
              <p className="text-3xl text-white font-bold leading-normal mb-1">#2</p>
              <p className="text-lg text-white font-regular leading-normal mb-1">John Doe</p>
              <p className="text-xl text-[#c5c5c2] font-bold leading-normal mb-1">12000</p>
            </div>
            <div className="mt-2 py-2 text-center">
              <div className="flex flex-wrap justify-center">
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </div>
              <p className="text-xs text-[#9e9cc8] font-regular leading-normal mb-1">@ssabbaji</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="relative max-w-[150px] mx-auto  min-w-0 break-words bg-[#2a2843] w-full mb-6 shadow-lg rounded-xl mt-20 h-[265px]">
          <div className="relative flex justify-center">
            <div className="absolute top-[-70px]">
              <Image
                src="/crown_icon.svg"
                alt="crown icon"
                className=""
                width={25}
                height={25}
              />
            </div>
          </div>
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  <Image
                    src="https://www.citedesartsparis.net/media/cia/188349-img_20200902_151505.jpg"
                    alt="Team member"
                    className="align-middle absolute -m-10 -ml-10 lg:-ml-9 max-w-[70px] border-2 border-yellow-500 rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
              </div>
              <div className="w-full text-center mt-9">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                </div>
              </div>
            </div>
            <div className="text-center ">
              <p className="text-3xl text-white font-bold leading-normal mb-1">#1</p>
              <p className="text-lg text-white font-regular leading-normal mb-1">John Doe</p>
              <p className="text-xl text-[#f4e240] font-bold leading-normal mb-1">12000</p>
            </div>
            <div className="mt-2 py-2 text-center">
              <div className="flex flex-wrap justify-center">
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </div>
              <p className="text-xs text-[#9e9cc8] font-semibold leading-normal mb-1">@ssabbaji</p>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="relative max-w-[150px] mx-auto  min-w-0 break-words bg-[#1B1A2D] w-full mb-6 shadow-lg rounded-xl mt-28">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  <Image
                    src="https://www.citedesartsparis.net/media/cia/188349-img_20200902_151505.jpg"
                    alt="Team member"
                    className="align-middle absolute -m-10 -ml-10 lg:-ml-9 max-w-[70px] border-2 border-[#d18c3d] rounded-full"
                    width={70}
                    height={70}
                  />
                </div>
              </div>
              <div className="w-full text-center mt-9">
                <div className="flex justify-center lg:pt-4 pt-8 pb-0">
                </div>
              </div>
            </div>
            <div className="text-center ">
              <p className="text-3xl text-white font-bold leading-normal mb-1">#3</p>
              <p className="text-lg text-white font-regular leading-normal mb-1">John Doe</p>
              <p className="text-xl text-[#d18c3d] font-bold leading-normal mb-1">12000</p>
            </div>
            <div className="mt-2 py-2 text-center">
              <div className="flex flex-wrap justify-center">
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </div>
              <p className="text-xs text-[#9e9cc8] font-medium leading-normal mb-1">@ssabbaji</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export type DisplayedInfo = {
  id: number,
  username: string,
  ex: number,
  rank: string,
  avatar: string,
  gamesWon: number
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
          <button className="hover:bg-[#333153] p-1 rounded-lg ">
            <NextUIUser
              avatarProps={{ radius: "lg", src: user?.profile?.avatar }}
              description={user.username}
              name={cellValue}
            >
            </NextUIUser>
          </button>
        );
      case "XP" || "Games Won":
        return <p className="text-default-400">{cellValue}</p>;
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
  }, [1]);


  return (
    <div className="p-0 m-0 w-2/3 flex " >
      {
        users.length === 0 ? (
          <Loader />
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
          gamesWon: user?.gamesWon,
          avatar: user?.profile?.avatar
        }));

        setUsers(transformedUsers);
        console.log("users : ", users);
        return res.data;
      } catch (err) {
        console.log(err);
      }
    };

    fetchUsers()

  }, []);


  return (
    <>
      {
        users.length === 0 ? (
          <Loader />
        ) : (
          <>
            <div className='w-full  flex justify-center bg-[#151424] '>
              <Podium users={users.slice(0, 3)} />
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