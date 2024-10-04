'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FormModal from '../FormModal'
import moment from 'moment'
import { role } from '@/lib/data'
import Table from '../Table'
import Pagination from '../Pagination'

type Props = {
    memberId: number | string | undefined
}

type Event = {
    event_id: number
    date: string
    name: string
    description: string
}

const columns = [
    {
        header: 'Event ID',
        accessor: 'event_id',
        className: 'hidden md:table-cell',
    },
    {
        header: ' Date',
        accessor: 'date',
        className: '',
    },
    {
        header: ' Name',
        accessor: 'name',
        className: '',
    },
    {
        header: 'Description',
        accessor: 'description',
        className: 'hidden lg:table-cell',
    },
]

const NotContributeEvents = ({ memberId }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [eventData, setEventData] = useState<Event[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    useEffect(() => {
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/get-not-contribute-events/${memberId}`,
                    { withCredentials: true },
                )
                if (res.data.success) {
                    setEventData(res.data.eventData)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const renderRow = (item: Event) => (
        <tr
            key={item.event_id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mrxPurpleLight"
        >
            <td className="hidden md:table-cell">{item.event_id}</td>
            <td className="">{moment.utc(item.date).local().format('YYYY-MM-DD')}</td>
            <td className="">{item.name}</td>
            <td className="hidden md:table-cell">{item.description}</td>
        </tr>
    )

    if (eventData.length > 0) {
        return (
            <div>
                {/* LIST */}
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={eventData}
                    recordFerPage={recordFerPage}
                    page={page}
                />
                {/* PAGINATION */}
                <Pagination
                    rowCount={eventData.length}
                    recordFerPage={recordFerPage}
                    page={page}
                    setPage={setPage}
                />
            </div>
        )
    }

    if (eventData.length === 0) {
        return <div>No not contribute events found for this member</div>
    }
}

export default NotContributeEvents
