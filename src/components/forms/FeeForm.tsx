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
    fee: z.string().min(1, { message: 'Membership fee is required!' }),
    description: z.string(),
})

type Inputs = z.infer<typeof schema>

const FeeForm = ({ type, data }: Props) => {
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
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/create-membership-fees`,
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
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/update-membership-fees/${data.fee_id}`,
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
            <h1 className="text-xl font-semibold">{`${
                type === 'create' ? 'Create a new Fee' : 'Update a Fee'
            }`}</h1>
            <span className="text-sm text-gray-400 font-medium">Fee Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Date"
                    name="date"
                    type="date"
                    defaultValue={moment.utc(data?.date).local().format('YYYY-MM-DD')}
                    register={register}
                    error={errors.date}
                />
                <InputField
                    label="Fee"
                    name="fee"
                    type="number"
                    defaultValue={data?.fee}
                    register={register}
                    error={errors.fee}
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

export default FeeForm
