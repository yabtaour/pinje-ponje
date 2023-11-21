'use client';
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User, getKeyValue } from '@nextui-org/react';
import Image from 'next/image';
import React from 'react';

const columns = [
  { name: "NAME", uid: "name" },
  { name: "ROLE", uid: "role" },
  { name: "STATUS", uid: "status" },

]


export const users = [
  {
    key: "1",
    name: "Tony Reichert",
    role: "CEO",
    status: "Active",
  },
  {
    key: "2",
    name: "Zoey Lang",
    role: "Technical Lead",
    status: "Paused",
  },
  {
    key: "3",
    name: "Jane Fisher",
    role: "Senior Developer",
    status: "Active",
  },
  {
    key: "4",
    name: "William Howard",
    role: "Community Manager",
    status: "Vacation",
  },
  {
    key: "5",
    name: "Emily Collins",
    role: "Marketing Manager",
    status: "Active",
  },
  {
    key: "6",
    name: "Brian Kim",
    role: "Product Manager",
    status: "Active",
  },
  {
    key: "7",
    name: "Laura Thompson",
    role: "UX Designer",
    status: "Active",
  },
  {
    key: "8",
    name: "Michael Stevens",
    role: "Data Analyst",
    status: "Paused",
  },
  {
    key: "9",
    name: "Sophia Nguyen",
    role: "Quality Assurance",
    status: "Active",
  },
  {
    key: "10",
    name: "James Wilson",
    role: "Front-end Developer",
    status: "Vacation",
  },
  {
    key: "11",
    name: "Ava Johnson",
    role: "Back-end Developer",
    status: "Active",
  },
  {
    key: "12",
    name: "Isabella Smith",
    role: "Graphic Designer",
    status: "Active",
  },
  {
    key: "13",
    name: "Oliver Brown",
    role: "Content Writer",
    status: "Paused",
  },
  {
    key: "14",
    name: "Lucas Jones",
    role: "Project Manager",
    status: "Active",
  },
  {
    key: "15",
    name: "Grace Davis",
    role: "HR Manager",
    status: "Active",
  },
  {
    key: "16",
    name: "Elijah Garcia",
    role: "Network Administrator",
    status: "Active",
  },
  {
    key: "17",
    name: "Emma Martinez",
    role: "Accountant",
    status: "Vacation",
  },
  {
    key: "18",
    name: "Benjamin Lee",
    role: "Operations Manager",
    status: "Active",
  },
  {
    key: "19",
    name: "Mia Hernandez",
    role: "Sales Manager",
    status: "Paused",
  },
  {
    key: "20",
    name: "Daniel Lewis",
    role: "DevOps Engineer",
    status: "Active",
  },
  {
    key: "21",
    name: "Amelia Clark",
    role: "Social Media Specialist",
    status: "Active",
  },
  {
    key: "22",
    name: "Jackson Walker",
    role: "Customer Support",
    status: "Active",
  },
  {
    key: "23",
    name: "Henry Hall",
    role: "Security Analyst",
    status: "Active",
  },
  {
    key: "24",
    name: "Charlotte Young",
    role: "PR Specialist",
    status: "Paused",
  },
  {
    key: "25",
    name: "Liam King",
    role: "Mobile App Developer",
    status: "Active",
  },
];




export const Podium = () => {
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


export const Leaderboard = () => {
  const [page, setPage] = React.useState(1);
  const rowsPerPage = 10;

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
            <User
              avatarProps={{ radius: "lg", src: user.avatar }}
              description={user.email}
              name={cellValue}
            >
              {user.email}
            </User>
          </button>
        );
      case "EXP":
        return <p className="text-default-400">{cellValue}</p>;

      case "Rank":
      case "Games Won":
      case "Visit Profile":
      default:
        return cellValue;
    }
  }, []);








  return (
    <div className="p-0 m-0">

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
        <TableHeader>
          <TableColumn className='bg-[#333153]' key="name">NAME</TableColumn>
          <TableColumn className='bg-[#333153]' key="role">ROLE</TableColumn>
          <TableColumn className='bg-[#333153]' key="status">STATUS</TableColumn>
        </TableHeader>
        <TableBody className="bg-[#000] " items={items}>
          {(item) => (
            <TableRow key={item.name}>
              {(columnKey) => <TableCell>{getKeyValue(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default function RankPage() {
  return (
    <>
      <div className='w-full flex justify-center bg-[#151424] '>
        <Podium />
      </div>

      <div className='bg-[#151424]'>
        <div className='w-full flex justify-center'>
          <Leaderboard />
        </div>

      </div>
    </>





  );
}