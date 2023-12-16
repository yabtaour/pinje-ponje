import { Doughnut } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { fetchGameHistory } from "@/app/utils/update";
import Image from 'next/image';

import { User } from '@/app/types/user';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);



export default function Performance({ user }: { user: User | null | undefined }) {

  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);


  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const data = await fetchGameHistory(user.id, localStorage.getItem("access_token"));
          const { wins, losses } = countWinsAndLosses(data);
          setWins(wins);
          setLosses(losses);
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }
  }, [user]);

  const countWinsAndLosses = (matchHistory : any) => {
    let wins = 0;
    let losses = 0;

    for (const match of matchHistory) {
        if (match.players[0].status === "WINNER") {
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
