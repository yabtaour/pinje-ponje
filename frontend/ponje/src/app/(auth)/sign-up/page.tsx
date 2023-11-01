'use client';

import Auth42Button, { AuthGoogleButton } from "@/app/components/buttons";
import { login } from "@/app/globalRedux/features/authSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import { handleSignup } from "@/app/utils/auth";
import { Toast } from "@chakra-ui/react";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Link from "next/link";

import { useRouter } from 'next/navigation';
import { useDispatch } from "react-redux";
import * as Yup from 'yup';


export default function SignUp() {

    const dispath = useDispatch();
    const authState = useAppSelector((state) => state.authReducer.value)
    const router = useRouter();

    const initialValues = {
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validationSchema = Yup.object().shape({
        // usename: Yup.string().required("Username is required"),
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



    const handleSubmit = async (values: any) => {
        try {
            const data = await handleSignup(values.email, values.password);
            console.log("this is the data from the signup : ", data);
            dispath(login(data));
            router.push('/dashboard');

        }
        catch (error) {
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
    };

    return (
        <div className="flex h-screen bg-gray-900">
            <div className="w-1/2">
                <img
                    src="/login_illust.png"
                    alt="Sample image"
                    className="w-[100%] h-full object-cover"
                    style={{ zIndex: 0 }}
                />
            </div>
            <div className="flex-1 flex flex-col justify-center items-center p-8">
                <h1 className="text-3xl text-cyan-300 mr-24 justify-between font-semibold mb-16">Hello hello!</h1>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    <Form>
                        <div className="flex flex-col relative mb-8">
                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Email</div>
                            <Field
                                name="email"
                                type="text"
                                placeholder="Email Address"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-600 border-slate-700 rounded pl-10"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="flex flex-col relative mb-8">
                            <div className="absolute top-[-1rem] text-slate-300 text-sm mb-8">Password</div>
                            <Field
                                name="password"
                                type="password"
                                placeholder=". . . . . . . ."
                                className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-600 rounded"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="flex flex-col relative mb-8">
                            <div className="absolute top-[-1rem] text-slate-300 text-sm mb-8">Confirm password</div>
                            <Field
                                name="confirmPassword"
                                type="password"
                                placeholder=". . . . . . . ."
                                className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-600 rounded"
                            />
                            <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
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
                <Auth42Button />
                <AuthGoogleButton />
                <div className="mt-4 font-semibold text-sm text-slate-500 mr-[100px] text-center md:text-left">
                    Already have an account? <Link className="text-cyan-200 hover:underline hover:underline-offset-4" href="/sign-in">Login</Link>
                </div>
            </div>
        </div>

    )
}