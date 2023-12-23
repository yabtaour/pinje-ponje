"use client";
import Auth42Button, { AuthGoogleButton } from "@/app/components/buttons";
import { login } from "@/app/globalRedux/features/authSlice";
import { useAppSelector } from "@/app/globalRedux/store";
import { useToast } from '@chakra-ui/react';
import { EyeIcon, EyeOffIcon } from '@heroicons/react/outline';
import { Link } from "@nextui-org/react";
import { getCookie } from "cookies-next";
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { handleLogin } from '../../utils/auth';



export default function SignIn() {
  //styling for toast
  const toast = useToast()

  const [passwordShown, setPasswordShown] = useState(false);
  const AuthState = useAppSelector((state) => state.authReducer.value)
  const dispatch = useDispatch();
  const router = useRouter();
  const [errorerrorMessage, setErrorMessage] = useState(null as any)
  const isAithenticated = useAppSelector((state) => state.authReducer.value.isAuthenticated);




  useEffect(() => {
    if (isAithenticated || getCookie('token'))
      router.push('/profile');
  }, [])






  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };



  const initialValues = {
    rememberMe: false,
    email: "",
    password: "",
  };


  const validationSchema = Yup.object().shape({
    rememberMe: Yup.boolean(),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });




  const handleSubmit = async (values: any) => {

    try {
      const data = await handleLogin(values.email, values.password);
      dispatch(login(data));
      if (data?.user?.twoFactor)
        router.push('/verification');
      else
        router.push('/profile');
    }
    // catch (error) {
    //   toast({
    //     title: 'Error',
    //     // description: errorMessage,
    //     status: 'error',
    //     duration: 9000,
    //     isClosable: true,
    //     position: "bottom-right",
    //     variant: "solid",
    //     colorScheme: "red",
    //   });
    // }
    catch (error) {
      const errorMessage = typeof error === 'object' && error && 'message' in error ? (error as Error).message : 'An error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
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
    <div className="flex h-screen relative overflow-hidden bg-gray-900">
      <div className="w-1/2">
        <Image
          src="/login_illust.png"
          alt="Sample image"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </div>
      <div className="flex-1 flex flex-col justify-center items-center p-8">
        <h1 className="text-3xl text-cyan-300 mr-24 justify-between font-semibold mb-16">
          Welcome back!
        </h1>
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
                className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-600 border-slate-700  rounded"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs" />
            </div>
            <div className="flex flex-col relative mb-8">
              <div className="absolute top-[-1rem] text-slate-300 text-sm">Password</div>
              <Field
                name="password"
                type={passwordShown ? "text" : "password"}
                placeholder=". . . . . . . ."
                className="text-sm w-80 px-4 py-3 border bg-gray-900 border-solid border-slate-700 placeholder-slate-500 rounded mt-4"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs" />
              <button
                onClick={togglePasswordVisibility}
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm"
              >
                {passwordShown ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="text-center md:text-left">
              <button
                className="mt-4 bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                type="submit"
              >
                Sign In
              </button>
              <div className="my-5 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-slate-700 after:mt-0.5 after:flex-1 after:border-t after:border-slate-700">
                <p className="mx-4 mb-0 text-center font-medium text-slate-500">OR</p>
              </div>
            </div>
          </Form>
        </Formik>
        <Auth42Button />
        <AuthGoogleButton />
        <div className="mt-4 font-semibold text-sm text-slate-500 mr-28 text-center md:text-left">
          Don't have an account? <Link className="text-cyan-200 hover:underline hover:underline-offset-4" href="/sign-up">Register</Link>
        </div>
      </div>
    </div>
  );
}
