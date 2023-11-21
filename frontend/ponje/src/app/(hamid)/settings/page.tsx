"use client"
import UploadAvatar from '@/app/components/avatarUpload';
import { UpdateUser } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData } from '@/app/utils/auth';

import Loader from '@/app/components/loader';

import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { Switch } from '@nextui-org/react';
import axios, { AxiosError } from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { resetPassword, updateUser } from "../../utils/update";
export default function UserSettings() {
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [resetPasswordError, setResetPasswordError] = useState("");
    const user = useAppSelector((state) => state.authReducer.value.user);
    const userToken = useAppSelector((state) => state.authReducer.value.token);
    const dispatch = useDispatch();
    const [twoFactorAuth, setTwoFactorAuth] = useState(user?.twofactor);

    useEffect(() => {
        const fetchData = async () => {
            if (!user) {
                const accessToken: string | null = localStorage.getItem('access_token');
                if (accessToken) {
                    const userData = await fetchUserData(accessToken);
                    dispatch(UpdateUser(userData));
                }
            }
        };

        fetchData();
    }, [user]);

    const [passwordShown, setPasswordShown] = useState(false);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };



    const initialValues = {
        username: user?.profile?.username ? user?.profile?.username : "",
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



    const handleTwoFactorAuth = async () => {

    };

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
            if (axios.isAxiosError(error)) {
                const err = error as AxiosError;
                if (err.response?.status === 401) {
                    setResetPasswordError("Incorrect password");
                }
            }
        }
        setSubmitting(false);
    };






    return (

        <div className="min-h-screen bg-[#151424] flex flex-col justify-center" style={{}}>
            {
                user === null ? (
                    <Loader />
                ) : (

                    <div className="max-w-3xl w-full mx-auto">
                        <h3 className="text-3xl font-semibold text-center text-[#4E40F4] mb-4">
                            Profile Settings
                        </h3>

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
                                                <p className='font-light text-xs text-slate-300'> we're sure you're special but keep it down to 60 characters</p>
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

                                        <div className="hidden lg:inline-block h-[450px] min-h-[1em] w-0.5 self-stretch bg-violet-950 opacity-100 dark:opacity-50"></div>
                                        <div className="relative text-[#73d3ff] m-5">
                                            <h2 className="p-2" >Activate 2FAuth</h2>
                                            <Switch {
                                                ...{
                                                    checked: twoFactorAuth,
                                                    onChange: () => {
                                                        console.log("twoFactorAuth : ", twoFactorAuth);
                                                        setTwoFactorAuth(!twoFactorAuth);
                                                    },
                                                }
                                            } aria-label="Automatic updates" />
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                    // {
                    //     showSuccessBadge && (
                    //         <div className="alert alert-success w-1/3">
                    //             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    //             <span>Your profile has been updated successfully!</span>
                    //         </div>
                    //     )
                    // }
                )
            }
        </div >

    );
}
