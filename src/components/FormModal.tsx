'use client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
// import TeacherForm from './forms/TeacherForm'
// import StudentForm from './forms/StudentForm'

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
    loading: () => <h1>Loading....</h1>,
})

const StudentForm = dynamic(() => import('./forms/StudentForm'), {
    loading: () => <h1>Loading....</h1>,
})

type Props = {
    table:
        | 'teacher'
        | 'student'
        | 'parent'
        | 'subject'
        | 'class'
        | 'lesson'
        | 'exam'
        | 'assignment'
        | 'result'
        | 'attendance'
        | 'event'
        | 'announcement'
    type: 'create' | 'update' | 'delete'
    data?: any
    id?: number
}

const forms: { [key: string]: (type: 'create' | 'update', data?: any) => JSX.Element } = {
    teacher: (type, data) => <TeacherForm type={type} data={data} />,
    student: (type, data) => <StudentForm type={type} data={data} />,
}

const FormModal = ({ table, type, data, id }: Props) => {
    const [open, setOpen] = useState(false)

    const size = type === 'create' ? 'w-8 h-8' : 'w-7 h-7'
    const bgColor =
        type === 'create' ? 'bg-mrxYellow' : type === 'update' ? 'bg-mrxSky' : 'bg-mrxPurple'

    // Add event listener for the Escape key
    useEffect(() => {
        const handleEsc = (event: any) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEsc)
        }

        return () => {
            document.removeEventListener('keydown', handleEsc) // Cleanup on unmount
        }
    }, [open])

    const Form = () => {
        return type === 'delete' && id ? (
            <form action={''} className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                    All data will be lost. Are you sure you want to delete this item {table}?
                </span>
                <button className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center">
                    Delete
                </button>
            </form>
        ) : type === 'create' || type === 'update' ? (
            forms[table](type, data)
        ) : (
            'Form not found!'
        )
    }

    return (
        <>
            <button
                className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
                onClick={() => setOpen(true)}
            >
                <Image src={`/${type}.png`} alt="" width={16} height={16} />
            </button>
            {open && (
                <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                        <Form />
                        <div
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 cursor-pointer"
                        >
                            <Image src={'/close.png'} alt="" width={14} height={14} />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default FormModal
