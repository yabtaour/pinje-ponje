import React from 'react'

export const MatchHistory = () => {
    return (
        <div className="overflow-x-auto">
            <table className="table">
                {/* head */}
                <thead>
                    <tr className='bg-[#333153]	'>
                        <th className='text-[#8C87E1]'>TYPE</th>
                        <th className='text-[#8C87E1]'>RESULT</th>
                        <th className='text-[#8C87E1]'>XP</th>
                        <th className='text-[#8C87E1]'>OPPONENT</th>
                        <th className='text-[#8C87E1]'>DATE</th>
                    </tr>
                </thead>
                <tbody>
                    {/* row 1 */}
                    <tr className='bg-[#1B1A2D]'>
                        <td>Normal</td>
                        <td className="px-4 py-3 text-xs ">
                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-300 rounded-sm"> WIN </span>
                        </td>
                        <td>+50</td>
                        <td>the voices</td>
                        <td>20 minutes ago</td>
                    </tr>
                    {/* row 2 */}
                    <tr className='bg-[#1B1A2D]'>
                        <td>Normal</td>
                        <td className="px-4 py-3 text-xs ">
                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-300 rounded-sm"> WIN </span>
                        </td>
                        <td>+50</td>
                        <td>the voices</td>
                        <td>20 minutes ago</td>
                    </tr>
                    {/* row 3 */}
                    <tr className='bg-[#1B1A2D]'>
                        <td>Normal</td>
                        <td className="px-4 py-3 text-xs ">
                            <span className="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-300 rounded-sm"> WIN </span>
                        </td>
                        <td>+50</td>
                        <td>the voices</td>
                        <td>20 minutes ago</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default MatchHistory;