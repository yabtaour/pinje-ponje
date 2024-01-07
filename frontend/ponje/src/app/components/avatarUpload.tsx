'use client';
import { useToast } from '@chakra-ui/react';
import { Image } from "@nextui-org/react";
import { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { UpdateUser } from '../globalRedux/features/authSlice';
import { useAppSelector } from '../globalRedux/store';
import { getToken } from '../utils/auth';
import axios from '../utils/axios';


export default function UploadAvatar() {
  const avatar = useAppSelector((state) => state.authReducer.value.user?.profile?.avatar);
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.authReducer.value.user);
  const toast = useToast();


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];

    if (uploadedFile) {

      if (uploadedFile.size > 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size exceeds 1MB limit.",
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        return;
      }

      const avatarBase64 = await convertToBase64(uploadedFile);

      try {
        const response = await axios.post(
          "/profiles/avatar",
          { avatarBase64 },
          {
            headers: {
              Authorization: getToken(),
              "Content-Type": "application/json",
            },
          }
        );

        const updatedUser = {
          ...user,
          profile: {
            ...user?.profile,
            avatar: response.data.avatar,
          },
        };

        dispatch(UpdateUser(updatedUser));
      } catch (error) {
        const err = error as AxiosError;
        toast({
          title: "Error",
          description: `Error in uploading avatar: ${err.message}`,
          status: "error",
          duration: 9000,
          isClosable: true,
          position: "bottom-right",
          variant: "solid",
          colorScheme: "red",
        });
        console.log(error);
      }
    }
  };

  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64 = base64String.split(",")[1];
        const fileType = base64String.split(",")[0].split(":")[1].split(";")[0];
        const base64WithPrefix = `data:${fileType};base64,${base64}`;
        resolve(base64WithPrefix);

        reader.onerror = (error) => {
          reject(error);
        };
      }
    });
  };


  useEffect(() => {
    console.log('avatar : ', avatar);
  }, [avatar]);




  return (
    <div className="flex items-center justify-center w-full mb-6">
      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center h-32 w-32 rounded-full cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 border-2 border-gray-300 p-0 border-dashed">
        <div className="flex flex-col items-center justify-center">
          {avatar ? (
            <div className="avatar">
              <div className="w-24 rounded-xl">
                <Image
                  src={avatar}
                  alt="user image"
                  sizes='(max-width: 768px) 100vw,
                                        (max-width: 1200px) 50vw,
                                        33vw'
                  style={{ objectFit: "cover" }}
                  className='rounded-full'
                />
              </div>
            </div>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="38" height="33" viewBox="0 0 58 53" fill="none">
              <path d="M52.5 13H44.575L40 8H25V13H37.8L42.375 18H52.5V48H12.5V25.5H7.5V48C7.5 50.75 9.75 53 12.5 53H52.5C55.25 53 57.5 50.75 57.5 48V18C57.5 15.25 55.25 13 52.5 13ZM20 33C20 39.9 25.6 45.5 32.5 45.5C39.4 45.5 45 39.9 45 33C45 26.1 39.4 20.5 32.5 20.5C25.6 20.5 20 26.1 20 33ZM32.5 25.5C36.625 25.5 40 28.875 40 33C40 37.125 36.625 40.5 32.5 40.5C28.375 40.5 25 37.125 25 33C25 28.875 28.375 25.5 32.5 25.5ZM12.5 13H20V8H12.5V0.5H7.5V8H0V13H7.5V20.5H12.5V13Z" fill="#C6BCBC" />
            </svg>
          )}
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} />
      </label>
    </div>
  );
}
