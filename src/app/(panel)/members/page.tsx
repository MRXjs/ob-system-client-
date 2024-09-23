'use client'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { role } from '@/lib/data'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

type Props = {}

type Member = {
    memberId: number
    fullName: string
    yearOfJoingSchool: string
    yearOfOutSchool: string
    studyPeriod?: string
    phoneNumber: number
    address: string
    job: string
    workplace: string
    dob: string
    gender: string
    civilStatus: string
    whatsappNumber: string
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
        header: ' Gender',
        accessor: 'gender',
        className: 'hidden md:table-cell',
    },
    {
        header: 'BirthDay',
        accessor: 'dob',
        className: 'hidden lg:table-cell',
    },
    {
        header: 'Civil Status',
        accessor: 'civilStatus',
        className: 'hidden lg:table-cell',
    },
    {
        header: 'Action',
        accessor: 'action',
    },
]

const MemberPage = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [memberData, setMemberData] = useState<Member[]>([])

    useEffect(() => {
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/members`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setMemberData(res.data.memberData)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const renderRow = (item: Member) => (
        <tr
            key={item.memberId}
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
                    <h3 className="font-semibold">{item.fullName}</h3>
                    <p className="text-xs text-gray-500">{'member'}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.memberId}</td>
            <td className="hidden md:table-cell">{item.gender}</td>
            <td className="hidden md:table-cell">
                {moment.utc(item.dob).local().format('YYYY-MM-DD')}
            </td>
            <td className="hidden md:table-cell">{item.civilStatus}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/members/${item.memberId}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-mrxSky">
                            <Image src={'/view.png'} alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === 'admin' && (
                        <FormModal table="member" type="delete" id={item.memberId} />
                    )}
                </div>
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Members</h1>
                <div className="flex flex-col md:flex-row  items-center gap-4  w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mrxYellow">
                            <Image src={'/filter.png'} alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mrxYellow">
                            <Image src={'/sort.png'} alt="" width={14} height={14} />
                        </button>
                        {role === 'admin' && <FormModal table="member" type="create" />}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={memberData} />
            {/* PAGINATION */}
            <Pagination />
        </div>
    )
}

export default MemberPage
