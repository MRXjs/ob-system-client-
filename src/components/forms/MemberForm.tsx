'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import InputField from '../InputField'
import Image from 'next/image'
import axios from 'axios'
import { toast } from 'react-toastify'
import moment from 'moment'
import Cropper, { Area, Point } from 'react-easy-crop'
import { useEffect, useState } from 'react'
import { FaFileUpload } from 'react-icons/fa'
import getCroppedImg from '@/lib/getCroppedImg'

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
    year_of_joining_school: z.string().min(4, { message: 'Enter the year!' }),
    year_of_out_school: z.string().min(4, { message: 'Enter the year!' }),
    registration_fee_paid: z.string(),
})

type Inputs = z.infer<typeof schema>

const MemberForm = ({ type, data }: Props) => {
    const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [avatar, setAvatar] = useState<any>(null)
    const [croppedImage, setCroppedImage] = useState<any>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    })

    useEffect(() => {
        if (data?.avatar) {
            setAvatar(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/avatar/${data.avatar}`)
            console.log(data.avatar)
        }
    }, [data])

    const handleFileChange = (e: any) => {
        const file = URL.createObjectURL(e.target.files[0]) as any
        setAvatar(file)
    }

    const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
        try {
            const croppedBlob = await getCroppedImg(avatar, croppedAreaPixels) // Utility to crop image
            setCroppedImage(croppedBlob)
        } catch (error) {
            console.error('Failed to crop image', error)
        }
    }

    console.log(croppedImage)

    const onSubmit = handleSubmit(async (formData: any) => {
        // because registration_fee_paid datatype is TINYINT
        formData.registration_fee_paid = Number(formData.registration_fee_paid)

        if (croppedImage) {
            try {
                const form = new FormData()
                form.append('avatar', croppedImage, 'avatar.png')
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/avatar-upload`,
                    form,
                    {
                        withCredentials: true,
                    },
                )
                if (res.data.success) {
                    formData.avatar = res.data.fileName
                }
            } catch (error: any) {
                if (error?.response?.data.message) {
                    return toast.error(error?.response?.data.message)
                }
            }
        }

        try {
            if (type === 'create') {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/add-member`,
                    formData,
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
            } else if (type === 'update') {
                const res = await axios.put(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/update-member/${data.memberId}`,
                    formData,
                    {
                        withCredentials: true,
                    },
                )
                if (res.data.success) {
                    toast.success(res.data.message)
                    // setTimeout(() => {
                    //     window.location.reload()
                    // }, 1000)
                }
            }
        } catch (error: any) {
            if (type === 'create') {
                try {
                    const res = await axios.delete(
                        `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/avatar-delete/${formData.avatar}`,
                        {
                            withCredentials: true,
                        },
                    )
                } catch (error) {
                    console.log(error)
                }
            }
            console.log(error)
            error?.response?.data.message && toast.error(error?.response?.data.message)
        }
    })

    return (
        <form className="flex flex-col gap-8 overflow-auto h-[95vh] p-5" onSubmit={onSubmit}>
            <h1 className="text-xl font-semibold text-center">
                {type === 'create' ? 'Create a new member' : 'Update a member'}
            </h1>
            <div className="flex items-center justify-center flex-col ">
                <div className="mb-2">
                    <Cropper
                        image={avatar}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape={'round'}
                        classes={{
                            containerClassName:
                                ' !relative w-80 h-80 bg-gray-200 rounded-2xl overflow-hidden',
                            mediaClassName: '',
                        }}
                    />
                </div>
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                />
                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                >
                    <FaFileUpload className="mr-2" />
                    Choose Image
                </label>
            </div>
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
                    name="year_of_joining_school"
                    defaultValue={data?.yearOfJoiningSchool}
                    register={register}
                    error={errors.year_of_joining_school}
                />
                <InputField
                    label="Year Of Out School"
                    name="year_of_out_school"
                    defaultValue={data?.yearOfOutSchool}
                    register={register}
                    error={errors.year_of_out_school}
                />
                <div className="flex flex-col gap-2 w-full md:w-1/4"></div>
            </div>
            {/* Payment Information */}
            <span className="text-sm text-gray-400 font-medium">Payment Information</span>
            <div className="flex justify-between flex-wrap gap-4 ">
                <div className="flex flex-col gap-2 w-full md:w-1/4">
                    <label className="text-xs text-gray-500">Registration Fee Paid </label>
                    <select
                        {...register('registration_fee_paid')}
                        defaultValue={data?.registrationFeePaid}
                        className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
                    >
                        <option value={0}>Unpaid</option>
                        <option value={1}>Paid</option>
                    </select>
                    {errors.registration_fee_paid?.message && ( // Fixed this error display
                        <p className="text-xs text-red-400">
                            {errors.registration_fee_paid?.message.toString()}
                        </p>
                    )}
                </div>
            </div>
            <button type="submit" className="bg-blue-400 text-white p-2 rounded-md">
                {type === 'create' ? 'Create' : 'Update'}
            </button>
        </form>
    )
}

export default MemberForm
