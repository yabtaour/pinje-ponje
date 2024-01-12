import { User } from '../../../types/user';
import Image from 'next/image';

export default function ProgressBar({ user }: { user: User | null | undefined }) {

  let level = user?.level ?? 0;
  let xp = user?.experience ?? 0;
  xp = (xp % 100 + 100) % 100;

  const xpToNextLevel = level !== 0 ? Math.min(100 - xp, 100) : 100;

  // const getRankImagePath = (level : number) => {
  //     if (level >= 0 && level <= 10) {
  //       return '/ranks/UNRANKED.svg';
  //     } else if (level > 10 && level <= 30) {
  //       return '/ranks/IRON.svg';
  //     } else if (level > 30 && level <= 60) {
  //       return '/ranks/BRONZE.svg';
  //     } else if (level > 60 && level <= 120) {
  //       return '/ranks/SILVER.svg';
  //     } else {
  //       return '/ranks/GOLD.svg';
  //     }
  //   };
  //   const rankImagePath = getRankImagePath(level);

  const getRankImagePath = (rank: string) => {
    switch (rank) {
      case 'UNRANKED':
        return '/ranks/UNRANKED.svg';
      case 'IRON':
        return '/ranks/IRON.svg';
      case 'BRONZE':
        return '/ranks/BRONZE.svg';
      case 'SILVER':
        return '/ranks/SILVER.svg';
      case 'GOLD':
        return '/ranks/GOLD.svg';
      default:
        return '/ranks/UNRANKED.svg';
    }
  };
  const rankImagePath = getRankImagePath(user?.rank?.toString() ?? 'UNRANKED');
  return (
    <>
      <div className='bg-[#1B1A2D] rounded-box w-[20rem] h-[8rem] md:w-[27rem] md:h-[12rem] mt-20 p-8 m-0'>
        <div className="flex lg:flex-row">
          <Image
            src={rankImagePath}
            alt="hero"
            className="w-16 h-16 md:w-24 md:h-24 rounded-full"
            width={100}
            height={100}
          />

          <div className="divider divider-horizontal before:bg-[#464671] after:bg-[#464671]"></div>
          <div className='pl-4'>
            <p className='text-[#77DFF8] text-xs'>LEVEL</p>
            <div className="flex flex-col lg:flex-row">
              <div className="flex items-center">
                <p className='text-[#77DFF8] text-xl lg:text-3xl'>{level}</p>
                <div className="divider divider-horizontal before:bg-secondary after:bg-secondary"></div>
                <p className='text-[#77DFF8] text-xl lg:text-3xl'>{xp} XP</p>
              </div>

            </div>
            <progress className="progress progress-primary w-32 md:w-60" value={xp} max={100}></progress>
            <p className='text-[#baecf9] text-xs'>{xpToNextLevel} XP to level {level + 1}</p>
          </div>
        </div>
      </div>
    </>
  )
}

