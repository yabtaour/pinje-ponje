
import { Modal, ModalContent } from '@nextui-org/react';
import { ErrorMessage, Field, Form, Formik, FormikProps } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';

enum RoomType {
    ROOM = "ROOM",
    DM = "DM"
}


export default function RoomOptions({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {

    const router = useRouter();


    const roomType: RoomType = RoomType.ROOM;



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
        onOpenChange();
    };

    return (
        <Modal
            className="max-w-4xl max-h-5xl "
            backdrop='blur'
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            radius="lg"
            classNames={{
                closeButton: 'hidden',
                base: "w-screen",
                backdrop: "bg-gray-900/50",
            }}
        >
            <ModalContent>
                {
                    roomType === RoomType.DM ? (

                        <div className="text-white flex flex-col items-center justify-center bg-[#222039] py-8">
                            <img className='rounded-full w-[10%]' src="https://i.redd.it/ow1iazp3ob351.jpg" alt="" />
                            <h1 className="text-2xl text-cyan-300 font-semibold ">
                                Hamid
                            </h1>
                            <h2>
                                BRONZE
                            </h2>
                            <button
                                className='text-blue-500 rounded-full p-2 '
                                onClick={() => {
                                    {
                                        console.log("clicked");
                                        router.push(`/profile/${2}`);
                                    }
                                }}>
                                Visit Profile
                            </button>


                        </div>

                    ) : (
                        <div className='flex flex-row items-center  justify-around py-12 bg-[#222039]'>


                            <div className="flex flex-col items-center justify-center ">
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


                            <div className='text-white '>
                                Members
                            </div>
                        </div>

                    )
                }
            </ModalContent>
        </Modal>
    );
}
