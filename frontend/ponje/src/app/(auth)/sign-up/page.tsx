'use client';

import Auth42Button, { AuthGoogleButton } from "@/app/components/buttons";
import { login } from "@/app/globalRedux/features/authSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import { handleSignup } from "@/app/utils/auth";
import { Toast } from "@chakra-ui/react";
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { AxiosError } from "axios";
import { getCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Image from "next/image";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';




export default function SignUp() {

    const dispatch = useDispatch();
    const authState = useAppSelector((state) => state.authReducer.value)
    const router = useRouter();
    const [passwordShown, setPasswordShown] = useState(false);
    const [confirmPasswordShown, setConfirmPasswordShown] = useState(false);
    const [userExistsError, setUserExistsError] = useState(false)
    const isAithenticated = useAppSelector((state) => state.authReducer.value.isAuthenticated);



    useEffect(() => {
        if (isAithenticated || getCookie('token'))
            router.push('/profile');
    }, [isAithenticated, router])


    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown);
    };
    const toggleConfirmPasswordVisibility = () => {
        setConfirmPasswordShown(!confirmPasswordShown);
    };

    const initialValues = {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
        username: Yup.string().required("Username is required"),
        email: Yup.string().email("Invalid email address").required("Email is required"),
        password: Yup.string()
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/,
                // "Password must be at least 8 characters long\n and contain at least one lowercase letter, one uppercase letter,\n one number, and one special character (!@#$%^&*)"
                "Password must be Strong, with at least 8 characters"
            )
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords do not match")
            .required("Confirm Password is required"),
    });



    const onSubmit = async (values: any) => {
        try {

            const data = await handleSignup(values.email, values.password, values.username);
            dispatch(login(data));
            router.push('/profile');
        } catch (error) {
            const err = error as AxiosError;
            if (err.message === "User already exists") {

                setUserExistsError(true);
                setTimeout(() => {
                    setUserExistsError(false);
                }, 4000);
            } else {
                Toast({
                    title: 'Error',
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                    position: "bottom-right",
                    variant: "solid",
                    colorScheme: "red",
                });
            }
        }
    };


    return (
        <div className="flex h-screen bg-gray-900">
            <div className="w-1/2">
                <Image
                    src="/login_illust.png"
                    alt="Sample image"
                    className="w-[100%] h-full object-cover"
                    style={{ zIndex: 0 }}
                    width={1920}
                    height={1080}
                    priority={true}
                />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <h1 className="text-3xl text-cyan-300 mr-24 justify-between font-semibold mb-16">Hello hello!</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <div className="flex flex-col relative mb-8">
                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Username</div>
                            <Field
                                name="username"
                                type="text"
                                placeholder="username"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-500 border-slate-700 rounded"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="flex flex-col relative mb-8 mt-[3rem]">
                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Email</div>
                            <Field
                                name="email"
                                type="text"
                                placeholder="Email Address"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-500 border-slate-700 rounded"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="flex flex-col relative mb-8 mt-[3rem]">
                            <div className="absolute top-[-2rem] text-slate-300 text-sm mb-8">Password</div>
                            <Field
                                name="password"
                                type={passwordShown ? "text" : "password"}
                                placeholder=". . . . . . . ."
                                className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-500 text-slate-200  rounded"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
                            <button
                                onClick={togglePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                                type="button"
                            >
                                {passwordShown ? (
                                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="flex flex-col relative mb-8 mt-[3rem]">
                            <div className="absolute top-[-2rem] text-slate-300 text-sm mb-8">Confirm password</div>
                            <Field
                                name="confirmPassword"
                                type={confirmPasswordShown ? "text" : "password"}
                                placeholder=". . . . . . . ."
                                className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-500 text-slate-200  rounded"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-xs" />
                            <button
                                onClick={toggleConfirmPasswordVisibility}
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
                            >
                                {confirmPasswordShown ? (
                                    <EyeOffIcon className="h-5 w-5 text-gray-400" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                        <div className="text-center md:text-left">
                            <button className="mt-4 bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm" type="submit">
                                Sign Up
                            </button>
                            <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-700">
                                <p className="mx-4 mb-0 text-center font-medium text-slate-500">OR</p>
                            </div>
                        </div>
                    </Form>
                </Formik>
                <Auth42Button type="signup" />
                <AuthGoogleButton type="signup" />
                <div className="mt-4 font-semibold text-sm text-slate-500 mr-[100px] text-center md:text-left">
                    Already have an account? <Link className="text-cyan-200 hover:underline hover:underline-offset-4" href="/sign-in">Login</Link>
                </div>
                {userExistsError ?
                    <div role="alert" className="alert alert-error w-92 mt-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Error! A user with those infos already exists</span>
                    </div>
                    : null}
            </div>
        </div>

    )
}