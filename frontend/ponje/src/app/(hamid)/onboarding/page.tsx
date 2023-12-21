'use client';

import UploadAvatar from "@/app/components/avatarUpload";
import { useAppSelector } from "@/app/globalRedux/store";
import axios from "@/app/utils/axios";
import { Textarea, useToast } from "@chakra-ui/react";
import { Modal, ModalContent, NextUIProvider } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';
import { Toast } from '@chakra-ui/react';




export default function Onboarding() {
    const toast = useToast()

    const [isOpen, setIsOpen] = useState(true);
    const AuthState = useAppSelector((state) => state.authReducer.value)
    const dispatch = useDispatch();
    const router = useRouter();
    const [errorerrorMessage, setErrorMessage] = useState(null as any)


    // const initialValues = {
    //     bio: "",
    // };


    const validationSchema = Yup.object().shape({
        // rememberMe: Yup.boolean(),
        // email: Yup.string().email("Invalid email address").required("Email is required"),
        // password: Yup.string().required("Password is required"),
    });
    const handleSubmit = async (values: any) => {
        try {
            const { bio } = values;
            axios.defaults.headers.common["Authorization"] = `${AuthState.token}`;
            const res = await axios.patch("/users", { bio })
            if (res.status === 200) {
                router.push("/dashboard");
            }
        } catch (error) {
            Toast({
                title: 'Error',
                status: 'error',
                duration: 9000,
                isClosable: true,
                position: "bottom-right",
                variant: "solid",
            });
            console.log(error);
        }
    }


    return (
        <NextUIProvider>
            <div className="bg-[#151424] h-screen w-screen">
                <Modal
                    className="max-w-4xl max-h-5xl "
                    isOpen={isOpen}
                    backdrop='blur'
                    // onOpenChange={() => {
                    //     setIsOpen(!isOpen);
                    // }}
                    // onClose={() => {
                    //     setIsOpen(!isOpen);
                    // }}
                    radius="lg"
                    classNames={{
                        closeButton: 'hidden',
                        base: "w-screen",
                        backdrop: "bg-gray-900/50",
                    }}
                >
                    <ModalContent>
                        {() => (
                            <>
                                <div className="flex flex-col items-center justify-center bg-gray-900 py-8">
                                    <h1 className="text-3xl text-cyan-300 font-semibold mb-4">
                                        Onboarding!
                                    </h1>
                                    <div className="flex items-center pb-[2rem]">
                                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="inline-block mr-2">
                                            <g fill="none" stroke="#0ea5e9" strokeLinejoin="round">
                                                <path strokeLinecap="round" d="M4 4.001h16v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-14Z" />
                                                <path strokeWidth="1.5" d="M12 8h.01v.01H12z" />
                                                <path strokeLinecap="round" d="M12 12v4" />
                                            </g>
                                        </svg>
                                        <p className="text-sm text-cyan-100 text-center">
                                            Please complete filling out your profile for a better experience.
                                        </p>
                                    </div>

                                    <Formik
                                        initialValues={{ bio: "" }}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {({ values, setFieldValue }) => (
                                            <Form>
                                                <div className="flex flex-col relative mb-8 mx-auto">

                                                    {/* <div className="flex  justify-center ">


<label htmlFor="avatar" className="cursor-pointer" style={{
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
}}>
<Avatar
style={{
    width: "5rem",
    height: "5rem",
    borderRadius: "50%",
}}
isBordered
color="default"
showFallback
fallback={
    <>
    <input
    type="file"
    id="avatar"
    name="avatar"
    accept="image/*"
    className="hidden"
    onChange={(event) => {
        const file = event.target.files?.[0];
        if (file) {
                                                                                setFieldValue("avatar", file);
                                                                            }
                                                                        }}
                                                                        />
                                                                        <svg width="48" height="48" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path fill="#ffffff" d="M19 13a1 1 0 0 0-1 1v.38l-1.48-1.48a2.79 2.79 0 0 0-3.93 0l-.7.7l-2.48-2.48a2.85 2.85 0 0 0-3.93 0L4 12.6V7a1 1 0 0 1 1-1h7a1 1 0 0 0 0-2H5a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-5a1 1 0 0 0-1-1ZM5 20a1 1 0 0 1-1-1v-3.57l2.9-2.9a.79.79 0 0 1 1.09 0l3.17 3.17l4.3 4.3Zm13-1a.89.89 0 0 1-.18.53L13.31 15l.7-.7a.77.77 0 0 1 1.1 0L18 17.21Zm4.71-14.71l-3-3a1 1 0 0 0-.33-.21a1 1 0 0 0-.76 0a1 1 0 0 0-.33.21l-3 3a1 1 0 0 0 1.42 1.42L18 4.41V10a1 1 0 0 0 2 0V4.41l1.29 1.3a1 1 0 0 0 1.42 0a1 1 0 0 0 0-1.42Z" />
                                                                        </svg>
                                                                        </>
                                                                    }
                                                                    />
                                                                    </label>
                                                                </div> */}
                                                    <UploadAvatar />


                                                </div>
                                                <div className="flex flex-col relative mb-8">
                                                    <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Bio</div>


                                                    <Field
                                                        name="bio"
                                                        type="text"
                                                        placeholder="Bio"
                                                        component={Textarea}
                                                        rows={4}
                                                        variant="outlined"
                                                        fullWidth
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            backgroundColor: "#1f2937",
                                                            color: "#fff",
                                                        }}
                                                    />
                                                    <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
                                                </div>
                                                {/* 
                                            <div className="flex flex-col relative mb-8 p-1">
                                                <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">username</div>
                                                <Field
                                                    name="username"
                                                    type="text"
                                                    placeholder="username"
                                                    className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                                />
                                                <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
                                            </div> */}

                                                {/* <div className="flex flex-col relative mb-8 p-1">
                                                <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Phone number</div>
                                                <Field
                                                    name="Phone number"
                                                    type="text"
                                                    placeholder="Phone number"
                                                    className="text-sm font-light w-80 px-4 py-3 text-white bg-gray-900 border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                                />
                                                <ErrorMessage name="Phone number" component="div" className="text-red-500 text-sm" />
                                            </div> */}

                                                <div className="flex justify-center">

                                                    <button
                                                        className="mt-4 bg-indigo-600 w-80 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                                                        type="submit"
                                                    >
                                                        submit
                                                    </button>
                                                </div>
                                            </Form>
                                        )}



                                    </Formik>
                                </div>

                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </NextUIProvider>
    )


}