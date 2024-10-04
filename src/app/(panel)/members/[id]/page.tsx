'use client'
import Announcements from '@/components/Announcements'
import BigCalendar from '@/components/BigCalendar'
import FormModal from '@/components/FormModal'
import Performance from '@/components/Performance'
import ShortCutModel from '@/components/ShortCutModel'
import { role } from '@/lib/data'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {
    params: { id: string }
}

const SingleMemberPage = ({ params }: Props) => {
    const id = params.id
    const [isLoading, setIsLoading] = useState(false)
    const [member, setMember] = useState({}) as any
    const [attendancePercentage, setAttendancePercentage] = useState(0)
    const [contributePercentage, setContributePercentage] = useState(0)
    const [paidPercentage, setPaidPercentage] = useState(0)

    useEffect(() => {
        setIsLoading(true)

        // get member data
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/member/${id}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setMember(res.data.member)
                }
            } catch (error) {
                console.log(error)
            }
        })()

        // meeting attendance percentage
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/member-meeting-attendance-percentage/${id}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setAttendancePercentage(res.data.attendancePercentageData.attendancePercentage)
                }
            } catch (error) {
                console.log(error)
            }
        })()

        // event contribute percentage
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/member-event-contribute-percentage/${id}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setContributePercentage(res.data.contributePercentageData.contributePercentage)
                }
            } catch (error) {
                console.log(error)
            }
        })()

        // event contribute percentage
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/member-membership-paid-percentage/${id}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setPaidPercentage(res.data.paidPercentageData.paidPercentage)
                }
            } catch (error) {
                console.log(error)
            }
        })()

        setIsLoading(false)
    }, [id])

    return (
        <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
            {/* LEFT */}
            <div className="w-full xl:w-2/3">
                {/* TOP */}
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* USER INFO CARD */}
                    <div className="bg-mrxSky py-6 px-4 rounded-md flex-1 flex gap-4">
                        {/* IMG CONTAINER */}
                        <div className="w-1/3">
                            <Image
                                src={'https://avatars.githubusercontent.com/u/95880266?v=4'}
                                alt=""
                                width={144}
                                height={144}
                                className="w-36 h-36 rounded-full object-cover"
                            />
                        </div>
                        {/* TEXT CONTAINER */}
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">{member.fullName}</h1>
                                {role === 'admin' && (
                                    <FormModal table="member" type="update" data={member} />
                                )}
                            </div>
                            <div className=" flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src={'/blood.png'} alt="" width={14} height={14} />
                                    <span>Member</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src={'/date.png'} alt="" width={14} height={14} />
                                    <span>
                                        {moment.utc(member.dob).local().format('YYYY-MM-DD')}
                                    </span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src={'/mail.png'} alt="" width={14} height={14} />
                                    <span>{member.address}</span>
                                </div>
                                <div className="w-full md:w-1/3 lg:w-full 2xl:w-1/3 flex items-center gap-2">
                                    <Image src={'/phone.png'} alt="" width={14} height={14} />
                                    <span>{member.phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* SMALL CARD */}
                    <div className="flex-1 flex gap-4 justify-between flex-wrap">
                        {/* CARD */}
                        <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ">
                            <Image
                                src={'/singleAttendance.png'}
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{`${attendancePercentage}%`}</h1>
                                <span className="text-sm text-gray-400">Attendance</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ">
                            <Image
                                src={'/singleBranch.png'}
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{`${contributePercentage}%`}</h1>
                                <span className="text-sm text-gray-400">Event</span>
                            </div>
                        </div>
                        {/* CARD */}
                        <div className=" bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] ">
                            <Image
                                src={'/singleLesson.png'}
                                alt=""
                                width={24}
                                height={24}
                                className="w-6 h-6"
                            />
                            <div className="">
                                <h1 className="text-xl font-semibold">{`${paidPercentage}%`}</h1>
                                <span className="text-sm text-gray-400">Fees</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* BOTTOM */}
                <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
                    <h1 className="text-center text-xl">Member&apos;s Details</h1>
                    <div className="mt-5 flex flex-col gap-5">
                        <div className="flex gap-5">
                            <label htmlFor="">Member ID</label>
                            <p className="font-semibold">{member.memberId}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Full Name</label>
                            <p className="font-semibold">{member.fullName}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Job</label>
                            <p className="font-semibold">{member.job}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Job Workplace</label>
                            <p className="font-semibold">{member.workplace}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Address</label>
                            <p className="font-semibold">{member.address}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Phone Number</label>
                            <p className="font-semibold">{member.phoneNumber}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">BirthDay</label>
                            <p className="font-semibold">
                                {moment.utc(member.dob).local().format('YYYY-MM-DD')}
                            </p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Gender</label>
                            <p className="font-semibold">{member.gender}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Civil Status</label>
                            <p className="font-semibold">{member.civilStatus}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Study period in school</label>
                            <p className="font-semibold">{`${member.yearOfJoingSchool} to ${member.yearOfOutSchool}`}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Whatsapp Number</label>
                            <p className="font-semibold">{member.whatsappNumber}</p>
                        </div>
                        <div className="flex gap-5 ">
                            <label htmlFor="">Facebook Name</label>
                            <p className="font-semibold">{member.facebookName}</p>
                        </div>
                    </div>
                    {/* <BigCalendar /> */}
                </div>
            </div>
            {/* RIGHT */}
            <div className="w-full xl:w-1/3 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-md">
                    <h1 className="text-xl font-semibold">Shortcuts</h1>
                    <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500 ">
                        <ShortCutModel type="Absence meeting" id={id} />
                        <ShortCutModel type="Not Contribute event" id={id} />
                        <ShortCutModel type="Unpaid fees" id={id} />
                        {/* <Link className="p-3 rounded-md bg-pink-50" href={'/'}>
                            Student&apos;s Exams
                        </Link>
                        <Link className="p-3 rounded-md bg-mrxSkyLight" href={'/'}>
                            Student&apos;s Assignments
                        </Link> */}
                    </div>
                </div>
                <Performance
                    attendancePercentage={attendancePercentage}
                    contributePercentage={contributePercentage}
                    paidPercentage={paidPercentage}
                />
            </div>
        </div>
    )
}

export default SingleMemberPage
