import { Doughnut } from 'react-chartjs-2';

import { User } from '@/app/types/user';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Performance({ user }: { user: User | null | undefined }) {

  

  const data = {
    labels: ['Loses', 'Wins'],
    datasets: [
      {
        label: 'games',
        data: [19, 3],
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

      <div className=" p-2 w-96 h-48 rounded flex justify-center">
        <Doughnut data={data} />;
      </div>
      </div>
    </div>
  )
}
