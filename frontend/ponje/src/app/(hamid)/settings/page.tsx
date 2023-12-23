"use client"
import UploadAvatar from '@/app/components/avatarUpload';
import Loader from '@/app/components/loader';
import { UpdateUser } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData } from '@/app/utils/auth';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { Modal, ModalContent, useDisclosure } from "@nextui-org/react";
import { AxiosError } from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import axios from '../../utils/axios';
import { resetPassword, updateUser } from "../../utils/update";
import { TwoFactorModal, TwoFactorModalDeactivate } from './components/TwoFactorModal';


export default function UserSettings() {
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [resetPasswordError, setResetPasswordError] = useState("");
    const user = useAppSelector((state) => state.authReducer.value.user);
    const userToken = useAppSelector((state) => state.authReducer.value.token);
    const dispatch = useDispatch();
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activationComplete, setActivationComplete] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
          try {
            let accessToken: string | null = localStorage.getItem('access_token');
            if (accessToken) {
              const userData = await fetchUserData(accessToken);
              const userChanged = JSON.stringify(user) !== JSON.stringify(userData);
              if (userChanged) {
                dispatch(UpdateUser(userData));
                setTwoFactorAuth(userData?.twoFactor);
                console.log("2FA VALUE", userData?.twoFactor);
                console.log("2FA VALUE in setter", twoFactorAuth);
              }
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        };
      
        fetchData();
      }, [user, dispatch, twoFactorAuth]);  // Ensure that the dependencies are correct
      

    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };

    const initialValues = {
        username: user?.profile.username ? user?.profile?.username : "",
        email: user?.email ? user?.email : "",
        bio: user?.profile?.bio ? user?.profile?.bio : "",
        oldpassword: "",
        newpassword: "",
        confirmnewpassword: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string(),
        email: Yup.string().email("Invalid email address"),
        oldpassword: Yup.string(),
        newpassword: Yup.string().when("oldpassword", {
            is: (oldpassword: string) => oldpassword && oldpassword.length > 0,
            then: (schema) => schema.required("New Password is required").min(8, 'Password must be at least 8 characters'),
        }),
        confirmnewpassword: Yup.string().when("newpassword", {
            is: (newpassword: string) => newpassword && newpassword.length > 0,
            then: (schema) => schema.required("Confirm Password is required").oneOf([Yup.ref('newpassword')], 'Passwords must match'),
        }),
        bio: Yup.string().max(60, 'Bio must be less than 60 characters'),

    });

    const onSubmit = async (values: any, { setSubmitting }: any) => {
        const { username, bio, oldpassword, newpassword, email } = values;
        let userProfileData = { username, bio, email };

        try {
            if (username || bio || email) {
                if (username === user?.profile?.username)
                    delete userProfileData.username
                if (email === user?.email)
                    delete userProfileData.email


                console.log("bio" + bio);
                const response = await updateUser(userProfileData, userToken);
                const updatedUser = {
                    ...user,
                    profile: {
                        ...user?.profile,
                        avatar: response.data.avatar,
                        twoFactor: twoFactorAuth,
                    },
                };

                dispatch(UpdateUser(updatedUser));
                console.log("updatedUser : ", updatedUser);
            }
            if (oldpassword && newpassword) {
                await resetPassword(oldpassword, newpassword);
                console.log("Password updated successfully.");
                setResetPasswordError("");
            }
            setShowSuccessBadge(true);
            setTimeout(() => setShowSuccessBadge(false), 5000);
        }
        catch (error) {
            console.log(error);
            const err = error as AxiosError;
            if (err.response?.status === 401) {
                setResetPasswordError("Incorrect password");
            }
        }
        setSubmitting(false);
    };

    const removeImage = async () => {
        try {
            const response = await axios.patch("/users", { avatar: null }, {
                headers: {
                    Authorization: userToken,
                },
            });
            if (response.data) {
                const updatedUser = {
                    ...user,
                    profile: {
                        ...user?.profile,
                        avatar: null,
                    },
                };
                dispatch(UpdateUser(updatedUser));
            } else {
                console.error("Failed to update user avatar:", response.data.message);
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error("Failed to update user avatar:", error);
            throw error;
        }

    };

    return (

        <div className="min-h-screen bg-[#151424] flex flex-col justify-center" style={{}}>
            {
                user === null ? (
                    <div className='min-h-screen'>
                        <Loader />;
                    </div>
                ) : (

                    <div className="max-w-3xl w-full mx-auto">
                        <h3 className="text-3xl font-semibold text-center text-[#4E40F4] mb-4">
                            User Settings 
                        </h3>
                        <p className='text-white font-bold text-center text-7xl mt-6'>{twoFactorAuth}</p>

                        <div className="bg-[#1B1A2D] p-8 rounded-lg h-full w-fill">
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={onSubmit}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="flex flex-col lg:flex-row gap-8">
                                        <div className="flex-1 flex flex-col items-center lg:items-start">
                                            <UploadAvatar />
                                            <button
                                                type="button"
                                                className="text-sm font-regular text-[#73d3ff] mb-8 underline"
                                                onClick={() => removeImage()}
                                            >
                                                remove profile picture
                                            </button>
                                            <div className="mb-4 w-full">
                                                <label htmlFor="username" className="text-sm font-regular text-[#73d3ff]">Username</label>
                                                <Field
                                                    id="username"
                                                    name="username"
                                                    type="text"
                                                    placeholder="Username"
                                                    className="text-sm font-light w-full px-4 py-3 text-white rounded border bg-[#1B1A2D] border-[#73d3ff]"
                                                />
                                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                                            </div>
                                            <div className="relative mb-4 w-full">
                                                <label htmlFor="bio" className="text-sm font-regular text-[#73d3ff]">Bio</label>
                                                <Field
                                                    as="textarea"
                                                    id="bio"
                                                    name="bio"
                                                    placeholder="bio"
                                                    maxLength={60}
                                                    className="peer block w-full rounded border text-white bg-[#1B1A2D] border-[#73d3ff] px-3 py-2 leading-6 outline-none transition-all duration-200 ease-linear focus:placeholder-opacity-100 dark:text-neutral-200 dark:placeholder:text-[#9AA0AD] placeholder:text-xs placeholder:font-light"
                                                    rows="4"
                                                />
                                                <p className='font-light text-xs text-slate-300'> we&apos;re sure you&apos;re special but keep it down to 60 characters</p>
                                                <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                        <div className="hidden lg:inline-block h-[450px] min-h-[1em] w-0.5 self-stretch bg-violet-950 opacity-100 dark:opacity-50"></div>
                                        <div className="flex-1 flex flex-col items-center lg:items-start">

                                            <div className="mb-4 w-full">
                                                <label htmlFor="email" className="text-sm font-regular text-[#73d3ff]">Email</label>
                                                <Field
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="Email Address"
                                                    className="text-sm font-light w-full px-4 py-3 text-white rounded border bg-[#1B1A2D] border-[#73d3ff]"
                                                />
                                                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <p className="text-xl font-regular pb-2 text-[#4E40F4]">Change password</p>
                                                <label htmlFor="oldpassword" className="text-sm font-regular text-[#73d3ff]">
                                                    Old Password
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        id="oldpassword"
                                                        name="oldpassword"
                                                        type={passwordShown ? "text" : "password"}
                                                        placeholder="******************"
                                                        className="text-sm font-light w-full pl-4 pr-10 py-3 text-white rounded border bg-[#1B1A2D] border-[#73d3ff]"
                                                    />
                                                    <ErrorMessage name="oldpassword" component="div" className="text-red-500 text-sm" />
                                                    {resetPasswordError && <div className="text-red-500 text-sm">{resetPasswordError}</div>}
                                                    <button
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                                                    >
                                                        {passwordShown ? (
                                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorMessage name="oldpassword" component="div" className="text-red-500 text-sm" />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label htmlFor="newpassword" className="text-sm font-regular text-[#73d3ff]">
                                                    New Password
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        id="newpassword"
                                                        name="newpassword"
                                                        type={passwordShown ? "text" : "password"}
                                                        placeholder="******************"
                                                        className="text-sm font-light w-full pl-4 pr-10 py-3 text-white rounded border bg-[#1B1A2D] border-[#73d3ff]"
                                                    />
                                                    <button
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                                                    >
                                                        {passwordShown ? (
                                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorMessage name="newpassword" component="div" className="text-red-500 text-sm" />
                                            </div>
                                            <div className="mb-4 w-full">
                                                <label htmlFor="confirmnewpassword" className="text-sm font-regular text-[#73d3ff]">
                                                    Confirm new Password
                                                </label>
                                                <div className="relative">
                                                    <Field
                                                        id="confirmnewpassword"
                                                        name="confirmnewpassword"
                                                        type={passwordShown ? "text" : "password"}
                                                        placeholder="******************"
                                                        className="text-sm font-light w-full pl-4 pr-10 py-3 text-white rounded border bg-[#1B1A2D] border-[#73d3ff]"
                                                    />
                                                    <button
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                                                    >
                                                        {passwordShown ? (
                                                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                                        ) : (
                                                            <EyeIcon className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </button>
                                                </div>
                                                <ErrorMessage name="confirmnewpassword" component="div" className="text-red-500 text-sm" />
                                            </div>

                                            <div className="flex justify-end w-full mt-10">
                                                <button
                                                    type="submit"
                                                    className="bg-emerald-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:bg-emerald-600 transition-all duration-150"
                                                    disabled={isSubmitting}
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>

                    </div>
                )
            }
            <div className='flex justify-center mt-6'>
                <button
                    className="bg-blue-500 w-1/5 text-white justify-center font-bold uppercase text-xs px-6 py-3 rounded shadow hover:bg-blue-600 transition-all duration-150"
                    onClick={onOpen}
                >
                    {twoFactorAuth ? (
                        <p>Deactivate 2FA</p>

                    ) : (
                        <p>Activate 2FA</p>
                    )}
                </button>
                {isOpen && (
                    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50">
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60"></div>
                        <Modal isOpen={isOpen} onClose={onClose}>
                            <ModalContent>
                                {twoFactorAuth ? (
                                    <TwoFactorModalDeactivate />
                                ) : (
                                    // <TwoFactorModal setActivationComplete={setActivationComplete} />
                                    <TwoFactorModal />
                                )}
                            </ModalContent>
                        </Modal>
                    </div>
                )}
            </div>
        </div >
    );
}

