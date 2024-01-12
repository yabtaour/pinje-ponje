'use client';

import UploadAvatar from "@/app/components/avatarUpload";
import { useAppSelector } from "@/app/globalRedux/store";
import axios from "@/app/utils/axios";
import { useToast } from "@chakra-ui/react";
import { Modal, ModalContent, NextUIProvider } from '@nextui-org/react';
import { ErrorMessage, Form, Formik, useField } from 'formik';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from 'yup';

interface MyTextAreaProps {
    label: string;
    id?: string;
    name?: string;
    rows?: string | number;
    placeholder?: string;
}

const MyTextArea = ({ label, rows, ...props }: MyTextAreaProps) => {
    const [field, meta] = useField(props as any);

    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea
                {...field}
                {...props}
                rows={Number(rows)}
                className="text-area bg-[#1E1D33]/60 text-white w-full p-2 rounded-lg focus:outline-none"
            />
            <ErrorMessage name="bio" component="div" className="text-red-500 text-sm" />
        </>
    );
};


export default function Onboarding() {
    const toast = useToast()

    const [isOpen, setIsOpen] = useState(true);
    const AuthState = useAppSelector((state) => state.authReducer.value)
    const dispatch = useDispatch();
    const router = useRouter();
    const [errorerrorMessage, setErrorMessage] = useState(null as any)

    const initialValues = {
        bio: "",
    };

    const validationSchema = Yup.object().shape({
        bio: Yup.string()
            .min(2, "Too Short!")
            .max(60, "Too Long!")
            .required("Required"),
    });
    const handleSubmit = async (values: any) => {
        try {
            const { bio } = values;
            const res = await axios.patch("/profiles", { bio }, {
                headers: {
                    Authorization: `${AuthState.token}`,
                },
            })
            if (res.status === 200) {
                router.push("/profile");
            }
        } catch (error) {
            toast({
                title: "Error.",
                description: "Error while editing user",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
    }


    return (
        <NextUIProvider>
            <div className="bg-[#151424] h-screen w-screen">
                <Modal
                    className="max-w-4xl max-h-5xl "
                    isOpen={isOpen}
                    backdrop='blur'
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

                                        initialValues={initialValues}
                                        validationSchema={validationSchema}
                                        onSubmit={handleSubmit}
                                    >
                                        {() => (
                                            <Form>
                                                <div className="flex flex-col relative mb-8 mx-auto">
                                                    <UploadAvatar />
                                                </div>
                                                <div className="flex flex-col relative mb-8">
                                                    <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Bio</div>
                                                    <MyTextArea
                                                        label=""
                                                        name="bio"
                                                        rows="6"
                                                        placeholder="Type you bio here."

                                                    />

                                                </div>
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