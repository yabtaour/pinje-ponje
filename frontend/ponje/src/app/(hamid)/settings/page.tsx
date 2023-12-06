"use client"
import UploadAvatar from '@/app/components/avatarUpload';
import { UpdateUser } from '@/app/globalRedux/features/authSlice';
import { useAppSelector } from '@/app/globalRedux/store';
import { fetchUserData } from '@/app/utils/auth';
import Loader from '@/app/components/loader';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { Switch } from '@nextui-org/react';
import axios from '../../utils/axios';
import { AxiosError } from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as Yup from 'yup';
import { resetPassword, updateUser, fetchQRCode } from "../../utils/update";
import QRCode from 'react-qr-code';
import Image from 'next/image';


export default function UserSettings() {
    const [isSelected, setIsSelected] = useState(true);
    const [showSuccessBadge, setShowSuccessBadge] = useState(false);
    const [resetPasswordError, setResetPasswordError] = useState("");
    const [TwoFactorNewState, setTwoFactorNewState] = useState(false);
    const user = useAppSelector((state) => state.authReducer.value.user);
    const userToken = useAppSelector((state) => state.authReducer.value.token);
    const dispatch = useDispatch();
    const [qrCodeData, setQrCodeData] = useState('');
    const [twoFactorAuth, setTwoFactorAuth] = useState(false);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         if (!user) {
    //             const accessToken: string | null = localStorage.getItem('access_token');
    //             if (accessToken) {
    //                 const userData = await fetchUserData(accessToken);
    //                 //print the value of twoFactor from the UserData
    //                 dispatch(UpdateUser(userData));
    //                 setTwoFactorAuth(userData?.twoFactor);
    //                 console.log("CHECK THIS VALUE ",userData?.twoFactor);
    //             }
    //         }
    //     };

    //     fetchData();
    // }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let accessToken: string | null = localStorage.getItem('access_token');
                if (accessToken)
                {
                    const userData = await fetchUserData(accessToken);
                    const userChanged = JSON.stringify(user) !== JSON.stringify(userData);
                    if (userChanged) {
                        dispatch(UpdateUser(userData));
                        setTwoFactorAuth(userData?.twoFactor);
                        if (userData?.twoFactor) {
                            const data = await fetchQRCode(accessToken);
                            setQrCodeData(data);
                        } else {
                            setQrCodeData('');
                        }
                    }
                }

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchData();
    }, [user, dispatch]);


    const [passwordShown, setPasswordShown] = useState(false);

    // useEffect(() => {
    //     if (twoFactorAuth) {
    //         fetchQRCode(userToken).then(data => {
    //             setQrCodeData(data);
    //         });
    //     }
    // }, [twoFactorAuth, userToken]);

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

    const handleTwoFactorAuth = async () => {
        try {
            console.log('twoFactorAuth value (handle 2fa function) :', twoFactorAuth);
            const newStatus = !twoFactorAuth;
            console.log('newStatus:', newStatus);

            const response = await axios.patch("/users", { twoFactor: newStatus }, {
                headers: {
                    Authorization: userToken,
                },
            });
            setTwoFactorAuth(newStatus); 

            if (newStatus && response.data && response.data.qrCode) {
                setQrCodeData(response.data.qrCode);
            } else {
                setQrCodeData(''); 
            }
            // if (response.data) {
            //     setTwoFactorAuth(newStatus);    
            //     if (newStatus && response.data.qrCode) {
            //         setQrCodeData(response.data.qrCode);
            //     }
            // } else {
            //     console.error("Failed to update user 2FA:", response.data.message);
            //     throw new Error(response.data.message);
            // }
        } catch (error) {
            console.error("Failed to update user 2FA (caught actual error :p):", error);
            throw error;
        }

    };
    const onSubmit = async (values: any, { setSubmitting }: any) => {
        const { username, bio, oldpassword, newpassword, email } = values;
        let userProfileData = { username, bio, email };
        // let userProfileData = { username, bio, email , TwoFactorNewState: twoFactorAuth};

        // console.log('twoFactorAuth value (handle 2fa function) :', twoFactorAuth);
        // // const newStatus = !twoFactorAuth;
        // console.log('newStatus:', TwoFactorNewState);

        // if (twoFactorAuth !== TwoFactorNewState) {
        try {
            await handleTwoFactorAuth();
            setTwoFactorAuth(TwoFactorNewState); 

        } catch (error) {
            console.error('Failed to update Two Factor Authentication:', error);
        }
        // }

        try {
            if (username || bio || email) {
                if (username === user?.profile?.username)
                    delete userProfileData.username
                if (email === user?.email)
                    delete userProfileData.email


                console.log("bio" + bio);
                const response = await updateUser(userProfileData, userToken);
                // setTwoFactorAuth(TwoFactorNewState); 
                // console.log('twoFactorAuth value (handle 2fa function) :', twoFactorAuth);

                // if (TwoFactorNewState && response.data && response.data.qrCode) {
                //     setQrCodeData(response.data.qrCode);
                // } else {
                //     setQrCodeData(''); 
                // }

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

                                        <div className="hidden lg:inline-block h-[450px] min-h-[1em] w-0.5 self-stretch bg-violet-950 opacity-100 dark:opacity-50"></div>
                                        <div className="relative text-[#73d3ff] m-5">
                                            <h2 className="p-2" >Activate 2FAuth</h2>
                                            <Switch 
                                            {
                                                ...{
                                                    //if i add this line the switch's state cant be changed 
                                                    // isSelected: twoFactorAuth,
                                                    onChange: () => {
                                                        setTwoFactorNewState(!twoFactorAuth);
                                                        setIsSelected(twoFactorAuth);
                                                },
                                                }
                                            } aria-label="Automatic updates" />
                                            <p>current value of checked : {twoFactorAuth ? "Yes" : "No"}   </p>
                                        <div className=''>
                                            {twoFactorAuth && qrCodeData && (
                                                <Image src={qrCodeData} alt="QR Code" width={200} height={200} className=' ' />
                                            )}
                                        </div>
                                        </div>
                                        {/* display the image under the switch */}
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

