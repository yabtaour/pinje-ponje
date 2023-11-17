'use client';
import Image from 'next/image';


export const Podium = () => {
  return (
    <div className="flex space-x-0" style={{

    }}>
      <div>
        <div className="relative max-w-[150px] mx-auto  min-w-0 break-words bg-[#1B1A2D] w-full mb-6 shadow-lg rounded-xl mt-28">
          <div className="px-6">
            <div className="flex flex-wrap justify-center">
              <div className="w-full flex justify-center">
                <div className="relative">
                  <Image
                    src="/docs/images/people/profile-picture-5.jpg"
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
                    src="/docs/images/people/profile-picture-5.jpg"
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
                    src="/docs/images/people/profile-picture-5.jpg"
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
  return (
    <div>
      <div className="overflow-x-auto w-1/2 ml  bg-[#1B1A2D]">
        <table className="table">
          <thead>
            <tr className='bg-[#333153] text-[#8C87E1]'>
              <th></th>
              <th>Name</th>
              <th>XP</th>
              <th>Games won</th>
              <th>Rank</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr>
              <td className='w-2'>
                <p className="text-3xl text-[#73d3ff] font-bold leading-normal mb-1">4</p>
              </td>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="/tailwind-css-component-profile-2@56w.png" alt="User profile pic" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">souki</div>
                    <div className="text-sm opacity-50">ssabbaji</div>
                  </div>
                </div>
              </td>
              <td>
                12000
                <br />
              </td>
              <td className='object-center'>30</td>
              {/* <td>Gold</td> */}
              <td>
                <img src="/rank_icon.svg" alt="hero" className="w-10 h-10 rounded-full object-center" />
              </td>
              <th>
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </th>
            </tr>
            {/* row 2 */}
            <tr>
              <td className='w-2'>
                <p className="text-2xl text-[#73d3ff] font-bold leading-normal mb-1">5</p>
              </td>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="/tailwind-css-component-profile-3@56w.png" alt="User profile pic" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">Amine</div>
                    <div className="text-sm opacity-50">rsaf</div>
                  </div>
                </div>
              </td>
              <td>
                11500
                <br />
              </td>
              <td>27</td>
              {/* <td>Gold</td> */}
              <td>
                <img src="/rank_icon.svg" alt="hero" className="w-10 h-10 rounded-full object-center" />
              </td>
              <th>
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </th>
            </tr>
            {/* row 3 */}
            <tr>
              <td className='w-2'>
                <p className="text-3xl text-[#73d3ff] font-bold leading-normal mb-1">6</p>
              </td>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="/tailwind-css-component-profile-4@56w.png" alt="User profile pic" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">escanor</div>
                    <div className="text-sm opacity-50">yabtaour</div>
                  </div>
                </div>
              </td>
              <td>
                11000
                <br />
              </td>
              <td>23</td>
              {/* <td>Silver</td> */}
              <td>
                <img src="/rank_icon.svg" alt="hero" className="w-10 h-10 rounded-full object-center" />
              </td>
              <th>
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </th>
            </tr>
            {/* row 4 */}
            <tr>
              <td className='w-2'>
                <p className="text-3xl text-[#73d3ff] font-bold leading-normal mb-1">7</p>
              </td>
              <td>
                <div className="flex items-center space-x-3">
                  <div className="avatar">
                    <div className="mask mask-squircle w-12 h-12">
                      <img src="/tailwind-css-component-profile-5@56w.png" alt="User profile pic" />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">dark hamid</div>
                    <div className="text-sm opacity-50">ahouari</div>
                  </div>
                </div>
              </td>
              <td>
                10337
                <br />
              </td>
              <td>20</td>
              {/* <td>Silver</td> */}
              <td>
                <img src="/rank_icon.svg" alt="hero" className="w-10 h-10 rounded-full object-center" />
              </td>
              <th>
                <button className="btn btn-ghost btn-xs text-[#4E40F4]">visit profile</button>
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function RankPage() {
  return (
    <div className="bg-[#151424] min-h-screen">
      <div className="ml-[800px]">
        <Podium />
      </div>
      <div className="ml-[670px]">
        <Leaderboard />
      </div>
    </div>
  );
}