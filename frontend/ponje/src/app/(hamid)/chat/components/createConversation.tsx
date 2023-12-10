import { useAppSelector } from "@/app/globalRedux/store";
import { Button, Card, CardBody, CardHeader, Image, Modal, ModalContent, ScrollShadow, User } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik, FormikProps } from "formik";
import { useState } from "react";
import * as Yup from 'yup';
import { Join } from "./actions";


export function JoinRooms({ onOpenChange, setAction }: { onOpenChange: () => void, setAction: (action: string) => void }) {
    const activeConversationId = useAppSelector(state => state?.chatReducer?.activeConversationId);
    const activeConversation = useAppSelector(state => state?.chatReducer?.rooms?.find((room: any) => room?.id === activeConversationId));
    const me = useAppSelector(state => state?.authReducer?.value?.user);



    return (
        <div className="flex flex-col items-center justify-center bg-[#222039] py-8">
            <h1>Rooms your can join</h1>

            <ScrollShadow hideScrollBar className=" h-[10vh]" />
            <div className="flex items-center">
                <User
                    className="text-white my-2"
                    name={<>hamid</>}
                    avatarProps={{ src: "https://i.redd.it/ow1iazp3ob351.jpg" }}
                />
                <Join />
            </div>
            <div className="flex items-center">
                <User
                    className="text-white my-2"
                    name={<>hamid</>}
                    avatarProps={{ src: "https://i.redd.it/ow1iazp3ob351.jpg" }}
                />
                <Join />
            </div>
            <div className="flex items-center">
                <User
                    className="text-white my-2"
                    name={<>hamid</>}
                    avatarProps={{ src: "https://i.redd.it/ow1iazp3ob351.jpg" }}
                />
                <Join />
            </div>
            <ScrollShadow />
        </div>
    )
}


export function CreateRoom({ onOpenChange, setAction }: { onOpenChange: () => void, setAction: (action: string) => void }) {


    const initialValues = {
        name: '',
        password: '',
        roomType: ''
    };

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        roomType: Yup.string().required('Room Type is required'),
    });

    const handleSubmit = (values: any) => {

        if (values.password === '') {
            delete values.password;
        }
        console.log("values: ", values);
        setAction('');
        onOpenChange();
    };


    return (
        <div className="flex flex-col items-center justify-center bg-[#222039] py-8">
            <img
                src="/groupChat.svg"
                alt="groupChat"
                className="w-10 h-10 "
            ></img>
            <h1 className="mb-10 text-2xl text-cyan-300 font-semibold ">
                Create a new conversation
            </h1>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values }: FormikProps<typeof initialValues>) => (
                    <Form>


                        <div className="flex flex-col relative mb-8 p-1">
                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Name</div>
                            <Field
                                name="name"
                                type="text"
                                placeholder="Room Name"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                            />
                            <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
                        </div>
                        <div className="flex flex-col relative mb-8 p-1">
                            <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Room Type</div>
                            <Field
                                as="select"

                                name="roomType"
                                type="text"
                                placeholder="Room Type"
                                className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                            >
                                <option value="">Select Room Type</option>
                                <option value="public">Public</option>
                                <option value="private">Private</option>
                                <option value="protected">protected </option>
                            </Field>
                            <ErrorMessage name="roomType" component="div" className="text-red-500 text-sm" />
                        </div>




                        {values.roomType === 'protected' && (
                            <div className="flex flex-col relative mb-8 p-1">
                                <div className="absolute top-[-2rem] text-slate-200 text-sm mb-8">Password</div>

                                <>
                                    <Field
                                        name="password"
                                        type="password"
                                        placeholder="password"
                                        className="text-sm font-light w-80 px-4 py-3 text-white bg-[#222038] border border-solid placeholder-slate-600 border-slate-700  rounded pl-10"
                                    />
                                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                                </>
                            </div>
                        )}
                        <div className="flex justify-center">

                            <button
                                className="mt-4 bg-indigo-600 w-40 hover:bg-blue-700 px-4 py-3 text-white rounded font-medium text-sm"
                                type="submit"
                            >
                                submit
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    )
}


export default function RoomOptions({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {


    const [action, setAction] = useState('');

    const handleOnOpenChange = () => {
        onOpenChange();
        setAction('');
    }

    return (
        <Modal
            className="max-w-4xl max-h-5xl "
            backdrop='blur'
            isOpen={isOpen}
            onOpenChange={handleOnOpenChange}
            radius="lg"
            classNames={{
                closeButton: 'hidden',
                base: "w-screen",
                backdrop: "bg-gray-900/50",
            }}
        >
            <ModalContent>
                {
                    action === 'create' ? (<CreateRoom onOpenChange={onOpenChange} setAction={setAction} />) : action === 'join' ? (<JoinRooms onOpenChange={onOpenChange} setAction={setAction} />) : (
                        <div className="flex flex-col items-center justify-center bg-[#222039] py-8">
                            <h1 className="text-white"> hamid</h1>
                            <div className="flex flex-row items-center ">
                                <Button onClick={() => { setAction('create'); }} >
                                    <Card className="hover:bg-slate-400/10 m-10 h-[150px]">
                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                            <p className="text-tiny uppercase font-bold text-white">Create a Room</p>

                                            <h4 className="font-bold text-large text-gray-400">hamid hamid</h4>
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2">
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl"
                                                src="/groups.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </CardBody>
                                    </Card>
                                </Button>
                                <Button onClick={() => { setAction('join'); }} >
                                    <Card className="hover:bg-slate-400/10 m-10 h-[150px]">
                                        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                                            <p className="text-tiny uppercase font-bold text-white">Join the rooms</p>

                                            <h4 className="font-bold text-large text-gray-400">hamid hamid</h4>
                                        </CardHeader>
                                        <CardBody className="overflow-visible py-2">
                                            <Image
                                                alt="Card background"
                                                className="object-cover rounded-xl"
                                                src="/groups.svg"
                                                width={100}
                                                height={100}
                                            />
                                        </CardBody>
                                    </Card>
                                </Button>
                            </div>
                        </div>)
                }

            </ModalContent>
        </Modal>
    );
}
