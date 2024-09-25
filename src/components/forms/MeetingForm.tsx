'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InputField from '../InputField'
import Image from 'next/image'
import { toast } from 'react-toastify'
import axios from 'axios'
import moment from 'moment'

type Props = {
    type: 'create' | 'update'
    data?: any
}

const schema = z.object({
    date: z.string().min(1, { message: 'Meeting date is required!' }),
    description: z.string(),
})

type Inputs = z.infer<typeof schema>

const MeetingForm = ({ type, data }: Props) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    const onSubmit = handleSubmit(async (formData) => {
        if (type === 'create') {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/create-meeting`,
                    formData,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            } catch (error: any) {
                console.log(error)
                error?.response?.data.message && toast.error(error?.response?.data.message)
            }
        } else if (type === 'update') {
            try {
                const res = await axios.put(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/update-meeting/${data.meeting_id}`,
                    formData,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    toast.success(res.data.message)
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000)
                }
            } catch (error: any) {
                console.log(error)
                error?.response?.data.message && toast.error(error?.response?.data.message)
            }
        }
    })

    return (
        <form className="flex flex-col gap-8" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold">Create a new meeting</h1>
            <span className="text-sm text-gray-400 font-medium">Meeting Information</span>
            <div className="flex items-center justify-center         flex-wrap gap-4">
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={moment.utc(data?.date).local().format('YYYY-MM-DD')}
                    register={register}
                    error={errors.date}
                />
                <InputField
                    label="Description"
                    name="description"
                    type="text"
                    defaultValue={data?.description}
                    register={register}
                    error={errors.description}
                />
            </div>

            <div className="flex justify-between flex-wrap gap-4"></div>
            <button className="bg-blue-400 text-white p-2 rounded-md">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default MeetingForm
