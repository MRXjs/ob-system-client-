'use client'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'

type Props = {
    meetingId: number | undefined
    data: any
}

type Member = {
    member_id: number
    meeting_id: number
    status: boolean
    full_name: string
}
const columns = [
    {
        header: 'Info',
        accessor: 'info',
    },
    {
        header: 'Member ID',
        accessor: 'memberId',
        className: 'hidden md:table-cell',
    },
    {
        header: 'Attendance',
        accessor: 'status',
        className: 'hidden lg:table-cell',
    },
    {
        header: 'Action',
        accessor: 'action',
    },
]

const MeetingView = ({ meetingId, data }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [memberData, setMemberData] = useState<Member[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/meeting-involves/${meetingId}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setMemberData(res.data.meetingInvolves)
                }
            } catch (error) {
                console.log(error)
            }

            setIsLoading(false)
        })()
    }, [])

    const attendanceHandler = async (event: any, item: any) => {
        const data = {
            member_id: item.member_id,
            meeting_id: item.meeting_id,
            status: event.target.checked,
        }

        setIsLoading(true)
        try {
            const res = await axios.put(
                `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/meeting-attendance-mark`,
                data,
                { withCredentials: true },
            )
            if (res.data.success) {
                const updatedMemberData = memberData.map((member: any) => {
                    if (
                        member.member_id === item.member_id &&
                        member.meeting_id === item.meeting_id
                    ) {
                        member.status = event.target.checked ? 0 : 1
                    }
                    return member
                })
                setMemberData(updatedMemberData)

                toast.success(res.data.message)
            }
        } catch (error: any) {
            console.log(error)
            error?.response?.data.message && toast.error(error?.response?.data.message)
        }
        setIsLoading(false)
    }

    const renderRow = (item: Member) => (
        <tr
            key={item.member_id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mrxPurpleLight"
        >
            <td className="flex items-center gap-4 p-4">
                <Image
                    src={'https://avatars.githubusercontent.com/u/95880266?v=4'}
                    alt=""
                    width={40}
                    height={40}
                    className="md:hidden xl:block w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.full_name}</h3>
                    <p className="text-xs text-gray-500">{'member'}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.member_id}</td>
            <td
                className={`hidden md:table-cell font-semibold ${
                    item.status ? 'text-green-500' : 'text-red-500'
                }`}
            >
                {isLoading ? (
                    <FaSpinner className="animate-spin h-6 w-6 mr-3 " />
                ) : item.status ? (
                    'Present'
                ) : (
                    'Absent'
                )}
            </td>
            <td className="flex items-center justify-between">
                <div>
                    <input
                        type="checkbox"
                        onChange={(event) => {
                            attendanceHandler(event, item)
                        }}
                        checked={item.status}
                        className=" w-5 h-5 cursor-pointer"
                    />
                </div>
                <div className="flex items-center justify-center gap-2">
                    <Link href={`/members/${item.member_id}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-mrxSky">
                            <Image src={'/view.png'} alt="" width={16} height={16} />
                        </button>
                    </Link>
                </div>
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between flex-col">
                <h1 className="hidden md:block text-lg font-semibold">{`Meeting  ${moment
                    .utc(data?.date)
                    .local()
                    .format('YYYY-MM-DD')} `}</h1>
                <span className="text-xs text-gray-500 font-semibold">{data.description}</span>
            </div>
            {/* LIST */}
            <Table
                columns={columns}
                renderRow={renderRow}
                data={memberData}
                recordFerPage={recordFerPage}
                page={page}
            />
            {/* PAGINATION */}
            <Pagination
                rowCount={memberData.length}
                recordFerPage={recordFerPage}
                page={page}
                setPage={setPage}
            />
        </div>
    )
}

export default MeetingView
