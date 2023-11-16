import { User } from '../../../types/user';

export default function ProgressBar({ user }: { user: User | null | undefined }) {

    let level = user?.profile?.level ?? 0;
    let xp = user?.profile?.experience ?? 0;
    xp = 102;
    level = 4;
    const xpPercentage = xp / (level * 100) * 100;


    return (
        <>
            <div className='bg-[#1B1A2D] rounded-box w-[27rem] h-[12rem] mt-20 p-8 m-0'>
                <div className="flex lg:flex-row">
                    <img src="/rank_icon.svg" alt="hero" className="w-24 h-24 rounded-full" />
                    <div className="divider lg:divider-horizontal before:bg-[#464671] after:bg-[#464671]"></div>
                    <div className='pl-4'>
                        <p className='text-[#77DFF8] text-xs'>LEVEL</p>
                        <div className="flex flex-col lg:flex-row">
                            <p className='text-[#77DFF8] text-3xl'>{level}</p>
                            <div className="divider lg:divider-horizontal before:bg-secondary after:bg-secondary"></div>
                            <p className='text-[#77DFF8] text-3xl'>{xp} XP</p>
                        </div>
                        <progress className="progress progress-primary w-60" value={xpPercentage} max={100}></progress>
                        <p className='text-[#baecf9] text-xs'>{(level * 100) - xp} XP to level {level + 1}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

