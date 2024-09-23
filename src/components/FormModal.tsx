'use client'
import axios from 'axios'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
// import TeacherForm from './forms/TeacherForm'
// import StudentForm from './forms/StudentForm'

const TeacherForm = dynamic(() => import('./forms/TeacherForm'), {
    loading: () => <h1>Loading....</h1>,
})

const MemberForm = dynamic(() => import('./forms/MemberForm'), {
    loading: () => <h1>Loading....</h1>,
})

type Props = {
    table:
        | 'teacher'
        | 'member'
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
    member: (type, data) => <MemberForm type={type} data={data} />,
}

const FormModal = ({ table, type, data, id }: Props) => {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const router = useRouter()

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

    const deleteHandler = async (e: any) => {
        e.preventDefault()

        setIsLoading(true)
        if (table === 'member') {
            try {
                const res = await axios.delete(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/delete-member/${id}`,
                    {
                        withCredentials: true,
                    },
                )
                if (res.data.success) {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            } catch (error: any) {
                console.log('test')
                error?.response?.data.message && toast.error(error?.response?.data.message)
            }
        }
        setIsLoading(false)
    }

    const Form = () => {
        return type === 'delete' && id ? (
            <form action={''} onSubmit={deleteHandler} className="p-4 flex flex-col gap-4">
                <span className="text-center font-medium">
                    All data will be lost. Are you sure you want to delete this item {table}?
                </span>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center flex items-center justify-center "
                >
                    {isLoading ? (
                        <FaSpinner className="animate-spin h-6 w-6 mr-3 text-white self-center" />
                    ) : (
                        'Delete'
                    )}
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
