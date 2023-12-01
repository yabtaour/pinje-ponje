
import {
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  PointElement,
  RadialLinearScale,
  Tooltip,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ['Accuracy', 'consistency', 'speed', 'reflex'],
  datasets: [
    {
      label: 'skills',
      data: [50, 61, 7, 24],
      backgroundColor: 'rgba(91, 143, 249, 0.5)',
      borderColor: 'rgba(91, 143, 249, 1)',
      borderWidth: 2,

    },
  ],
};

const options: ChartOptions<'radar'> = {
  scales: {
    r: {
      angleLines: {
        display: false,
      },
      grid: {
        color: '#333',
      },

      suggestedMin: 0,
      suggestedMax: 100,
    },
  },
};


export default function SkillAnalytics() {
  return (
    <div className="m-0 p-4 w-[20rem] ">
      <h2 className="text-2xl font-light text-[#4E40F4] mb-6"> Skill Analytics </h2>
      <div className="bg-[#1B1A2D]  rounded shadow-lg">
        <Radar options={options} data={data} />;
      </div>
    </div>
  )
}
