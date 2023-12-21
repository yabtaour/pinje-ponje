'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { UpdateUser } from '../globalRedux/features/authSlice';
import { useAppSelector } from '../globalRedux/store';
import axios from '../utils/axios';


export default function UploadAvatar() {
    const avatar = useAppSelector((state) => state.authReducer.value.user?.profile?.avatar);
    const dispatch = useDispatch();
    const user = useAppSelector((state) => state.authReducer.value.user);



    const handleFileChange = async (event: any) => {
        const uploadedFile = event.target.files[0];

        const formData = new FormData();
        formData.append('file', uploadedFile);

        try {
            const response = await axios('/profiles/avatar', {
                method: 'POST',
                data: formData,
                headers: {
                    Authorization: `${localStorage.getItem('access_token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedUser = {
                ...user,
                profile: {
                    ...user?.profile,
                    avatar: response.data.avatar,
                },
            };

            dispatch(UpdateUser(updatedUser));

        } catch (error) {
            console.log(error);
        }
    };


    useEffect(() => {
        console.log('avatar : ', avatar);
    }, [avatar]);



    return (
        <div className="flex items-center justify-center w-full mb-6">
            <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center h-32 w-32 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 border-2 border-gray-300 border-dashed">
                <div className="flex flex-col items-center justify-center">
                    {/* {avatar ? (
                        <img src={'/cartman.png'} alt="User Avatar" className="w-32 h-32 rounded-full" />
                    ) : ( */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="38" height="33" viewBox="0 0 58 53" fill="none">
                            <path d="M52.5 13H44.575L40 8H25V13H37.8L42.375 18H52.5V48H12.5V25.5H7.5V48C7.5 50.75 9.75 53 12.5 53H52.5C55.25 53 57.5 50.75 57.5 48V18C57.5 15.25 55.25 13 52.5 13ZM20 33C20 39.9 25.6 45.5 32.5 45.5C39.4 45.5 45 39.9 45 33C45 26.1 39.4 20.5 32.5 20.5C25.6 20.5 20 26.1 20 33ZM32.5 25.5C36.625 25.5 40 28.875 40 33C40 37.125 36.625 40.5 32.5 40.5C28.375 40.5 25 37.125 25 33C25 28.875 28.375 25.5 32.5 25.5ZM12.5 13H20V8H12.5V0.5H7.5V8H0V13H7.5V20.5H12.5V13Z" fill="#C6BCBC" />
                        </svg>
                    {/* )} */}
                </div>
                <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
            </label>
        </div>
    );
}
