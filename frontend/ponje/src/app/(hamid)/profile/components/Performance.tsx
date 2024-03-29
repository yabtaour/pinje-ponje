import { fetchGameHistory } from "@/app/utils/update";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

import { User } from '@/app/types/user';
import { getToken } from '@/app/utils/auth';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { useToast } from "@chakra-ui/react";


ChartJS.register(ArcElement, Tooltip, Legend);



export default function Performance({ user }: { user: User | null | undefined }) {
  const toast = useToast();
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);


  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const token = getToken();
          const data = await fetchGameHistory(user.id, token);
          const { wins, losses } = countWinsAndLosses(data);
          setWins(wins);
          setLosses(losses);
        } catch (err) {
          toast({
            title: 'Error',
            description: "error while fetching game history",
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: "bottom-right",
            variant: "solid",
            colorScheme: "red",
          })
        }
      };
      fetchData();
    }
  }, [user]);

  const countWinsAndLosses = (matchHistory: any) => {
    let wins = 0;
    let losses = 0;
    for (const match of matchHistory) {
      const opponent = match?.players[0].user.username === user?.username
      ? match?.players[0]
      : match?.players[1];
      if (opponent.status === "WINNER") {
        wins++;
      } else {
        losses++;
      }
    }
    return { wins, losses };
  };

  const data = {
    labels: ['Loses', 'Wins'],
    datasets: [
      {
        label: 'games',
        data: [losses, wins],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(75, 192, 192, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
        redraw: true,
      },
    ],
  };



  return (
    <div className="p-3 h-[15rem] rounded-full">
      <h2 className=" text-2xl font-light text-[#4E40F4] mb-6"> Performance </h2>
      <div className='bg-[#1B1A2D] h-full flex justify-center flex-col'>

        {wins === 0 && losses === 0 ? (
          <div className='flex flex-col justify-center items-center p-8'>
            <Image
              src="/noData.svg"
              alt="empty"
              width={120}
              height={120}
              style={{ width: 'auto', height: 'auto' }}
            />
            <p className="text-center text-gray-400 text-sm mt-3">No win/loss data for this user</p>
          </div>
        ) : (
          <div className="p-2 w-72 h-48 rounded flex justify-center">
            <Doughnut data={data} />
          </div>
        )}
      </div>
    </div>
  )
}
