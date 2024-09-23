'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InputField from '../InputField'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'

type Props = {
    type: 'create' | 'update'
    data?: any
}

const schema = z.object({
    member_id: z.string().min(1, { message: 'Member ID is required!' }),
    full_name: z.string().min(1, { message: 'Full Name is required!' }),
    dob: z.string().min(1, { message: 'Birthday is required!' }), // Changed to string validation
    gender: z.enum(['male', 'female'], { message: 'Gender is required!' }),
    civil_status: z.enum(['single', 'married', 'divorced', 'widowed'], {
        message: 'Civil Status is required!',
    }),
    facebook_name: z.string().min(1, { message: 'Facebook Name is required!' }), // Fixed error message
    phone_number: z
        .string()
        .min(10, { message: 'Phone number is required!' })
        .max(15, { message: 'Max 15 characters' }),
    address: z.string().min(1, { message: 'Address is required!' }),
    whatsapp_number: z.string().min(10, { message: 'Whatsapp Number is required!' }),
    workplace: z.string().optional(),
    job: z.string().optional(),
    year_of_joing_school: z.string().min(4, { message: 'Enter the year!' }),
    year_of_out_school: z.string().min(4, { message: 'Enter the year!' }),
})

type Inputs = z.infer<typeof schema>

const MemberForm = ({ type, data }: Props) => {
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
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/add-member`,
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
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/update-member/${data.memberId}`,
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
            <h1 className="text-xl font-semibold">Create a new member</h1>
            <span className="text-sm text-gray-400 font-medium">Personal Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Member Id"
                    name="member_id"
                    defaultValue={data?.memberId}
                    register={register}
                    error={errors.member_id}
                />
                <InputField
                    label="Full Name"
                    name="full_name"
                    type="text"
                    defaultValue={data?.fullName}
                    register={register}
                    error={errors.full_name}
                />
                <InputField
                    label="BirthDay"
                    name="dob"
                    type="date"
                    defaultValue={moment.utc(data?.dob).local().format('YYYY-MM-DD')}
                    register={register}
                    error={errors.dob}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Gender</label>
                    <select
                        {...register('gender')}
                        defaultValue={data?.gender}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value={'male'}>Male</option>
                        <option value={'female'}>Female</option>
                    </select>
                    {errors.gender?.message && (
                        <p className="text-xs text-red-400">{errors.gender?.message.toString()}</p>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Civil Status</label>
                    <select
                        {...register('civil_status')}
                        defaultValue={data?.civilStatus}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value={'single'}>Single</option>
                        <option value={'married'}>Married</option>
                        <option value={'divorced'}>Divorced</option>
                        <option value={'widowed'}>Widowed</option>
                    </select>
                    {errors.civil_status?.message && ( // Fixed this error display
                        <p className="text-xs text-red-400">
                            {errors.civil_status?.message.toString()}
                        </p>
                    )}
                </div>
                <InputField
                    label="Workplace"
                    name="workplace"
                    defaultValue={data?.workplace}
                    register={register}
                    error={errors.workplace}
                />
                <InputField
                    label="Job"
                    name="job"
                    defaultValue={data?.job}
                    register={register}
                    error={errors.job}
                />
            </div>

            {/* Contact Information */}
            <span className="text-sm text-gray-400 font-medium">Contact Information</span>
            <div className="flex justify-between flex-wrap gap-4">
                <InputField
                    label="Phone Number"
                    name="phone_number"
                    defaultValue={data?.phoneNumber}
                    register={register}
                    error={errors.phone_number}
                />
                <InputField
                    label="Address"
                    name="address"
                    defaultValue={data?.address}
                    register={register}
                    error={errors.address}
                />
                <InputField
                    label="Facebook Name"
                    name="facebook_name"
                    type="text"
                    defaultValue={data?.facebookName}
                    register={register}
                    error={errors.facebook_name}
                />
                <InputField
                    label="Whatsapp Number"
                    name="whatsapp_number"
                    defaultValue={data?.whatsappNumber}
                    register={register}
                    error={errors.whatsapp_number}
                />
            </div>

            {/* School Information */}
            <span className="text-sm text-gray-400 font-medium">School Information</span>
            <div className="flex justify-between flex-wrap gap-4 ">
                <InputField
                    label="Year of Joining School"
                    name="year_of_joing_school"
                    defaultValue={data?.yearOfJoingSchool}
                    register={register}
                    error={errors.year_of_joing_school}
                />
                <InputField
                    label="Year Of Out School"
                    name="year_of_out_school"
                    defaultValue={data?.yearOfOutSchool}
                    register={register}
                    error={errors.year_of_out_school}
                />
            </div>

            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default MemberForm
