'use client'
import axios from 'axios'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import FormModal from '../FormModal'
import Table from '../Table'
import Pagination from '../Pagination'

type Props = {
    memberId: number | string | undefined
}

type Meeting = {
    meeting_id: number
    date: string
    description: string
}
const columns = [
    {
        header: 'Meeting ID',
        accessor: 'meeting_id',
        className: 'hidden md:table-cell',
    },
    {
        header: ' Date',
        accessor: 'date',
        className: '',
    },
    {
        header: 'Description',
        accessor: 'description',
        className: 'hidden lg:table-cell',
    },
]

const AbsentMeetings = ({ memberId }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [meetingsData, setMeetingsData] = useState<Meeting[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/get-absent-meetings/${memberId}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setMeetingsData(res.data.meetingData)
                }
            } catch (error) {
                console.log(error)
            }

            setIsLoading(false)
        })()
    }, [])

    const renderRow = (item: Meeting) => (
        <tr
            key={item.meeting_id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mrxPurpleLight"
        >
            <td className="hidden md:table-cell">{item.meeting_id}</td>
            <td className="">{moment.utc(item.date).local().format('YYYY-MM-DD')}</td>
            <td className="hidden md:table-cell">{item.description}</td>
        </tr>
    )

    if (meetingsData.length > 0) {
        return (
            <div>
                {/* LIST */}
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={meetingsData}
                    recordFerPage={recordFerPage}
                    page={page}
                />
                {/* PAGINATION */}
                <Pagination
                    rowCount={meetingsData?.length}
                    recordFerPage={recordFerPage}
                    page={page}
                    setPage={setPage}
                />
            </div>
        )
    }

    if (meetingsData.length === 0) {
        return <div>No absent meetings found for this member</div>
    }
}

export default AbsentMeetings
