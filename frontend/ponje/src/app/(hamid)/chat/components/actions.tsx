import { Button } from "@nextui-org/react"

export function Ban() {
    return (<div className=' p-3 flex flex-col align-middle justify-center '>
        <svg className='hover:bg-red-500/10' width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
            <path fill="red" d="M425.706 86.294A240 240 0 0 0 86.294 425.705A240 240 0 0 0 425.706 86.294ZM256 48a207.1 207.1 0 0 1 135.528 50.345L98.345 391.528A207.1 207.1 0 0 1 48 256c0-114.691 93.309-208 208-208Zm0 416a207.084 207.084 0 0 1-134.986-49.887l293.1-293.1A207.084 207.084 0 0 1 464 256c0 114.691-93.309 208-208 208Z" />
        </svg>
    </div>)
}

export function Mute({ muted }: { muted: Boolean }) {
    return (
        <div className=' p-3 flex flex-col align-middle justify-center '>
            {
                muted ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" d="M17 21a1.06 1.06 0 0 1-.57-.17L10 16.43H5a1 1 0 0 1-1-1V8.57a1 1 0 0 1 1-1h5l6.41-4.4A1 1 0 0 1 18 4v16a1 1 0 0 1-1 1ZM6 14.43h4.33a1 1 0 0 1 .57.17l5.1 3.5V5.9l-5.1 3.5a1 1 0 0 1-.57.17H6Z" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path fill="currentColor" fill-rule="evenodd" d="M1.5 5h2.79l3.86-3.83l.85.35v13l-.85.33L4.29 11H1.5l-.5-.5v-5l.5-.5zm3.35 5.17L8 13.31V2.73L4.85 5.85L4.5 6H2v4h2.5l.35.17zm9.381-4.108l.707.707L13.207 8.5l1.731 1.732l-.707.707L12.5 9.207l-1.732 1.732l-.707-.707L11.793 8.5L10.06 6.77l.707-.707l1.733 1.73l1.731-1.731z" clip-rule="evenodd" />
                    </svg>
                )
            }
        </div>
    )

}

export function Play() {
    return (
        <div className='   flex flex-col align-middle justify-center '>
            <svg className='hover:fill-blue-500  rounded-full ' width="24" height="24" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="m498.03 15.125l-87.06 34.72l-164.5 164.5l-34.657-32.095l31.156-28.844l-223-133.594L176.155 164.5l-31.094 28.813l63.563 58.875l-70.03 70.03a398.93 398.93 0 0 0 8.968 10.438l9.656 9.656l71.5-71.5l13.718 12.688l-72 72l9.843 9.844a405.858 405.858 0 0 0 10.657 9.187l72-72l40.782 37.75l-29 26.876l223 133.594l-158.69-146.97l29-26.842l-67.217-62.282l162.5-162.5l34.718-87.03zm-67.34 53.688l13.218 13.218L280.28 245.657l-13.717-12.687L430.688 68.812zm-341 216.875L61.874 313.5L199.22 450.875l27.81-27.844c-56.283-34.674-103.014-81.617-137.343-137.342zM108.44 386.5l-81 81l17.75 17.75l81-81l-17.75-17.75z" />
            </svg>

        </div>
    )
}

export function Invite() {

    return (
        <div className='flex rounded-full flex-col justify-center mx-5  p-4 '>
            <svg className='hover:bg-blue-700' width="32" height="32" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path fill="currentColor" d="M11.5 12.5H6v-1h5.5V6h1v5.5H18v1h-5.5V18h-1v-5.5Z" />
            </svg>
        </div>
    )

}


export function Join() {

    return (
        <div className='flex rounded-full flex-col justify-center mx-5  p-4 '>
            <Button className=" px-5  border hover:bg-blue-700/10 border-blue-700/10">
                <svg className="" width="24" height="24" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M.5 9.5h9a4 4 0 0 0 0-8h-3" />
                        <path d="m3.5 6.5l-3 3l3 3" />
                    </g>
                </svg>
            </Button>
        </div>

    )

}