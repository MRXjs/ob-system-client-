'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import FormModal from '../FormModal'
import { role } from '@/lib/data'
import moment from 'moment'
import Table from '../Table'
import Pagination from '../Pagination'

type Props = {
    memberId: number | string | undefined
}

type Fee = {
    fee_id: number
    date: string
    fee: string
    description: string
}

const columns = [
    {
        header: 'Fee ID',
        accessor: 'fee_id',
        className: 'hidden md:table-cell',
    },
    {
        header: ' Date',
        accessor: 'date',
        className: '',
    },
    {
        header: ' fee',
        accessor: 'fee',
        className: '',
    },
    {
        header: 'Description',
        accessor: 'description',
        className: 'hidden lg:table-cell',
    },
]

const UnpaidFees = ({ memberId }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [feesData, setFeesData] = useState<Fee[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    useEffect(() => {
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/get-unpaid-fees/${memberId}`,
                    {
                        withCredentials: true,
                    },
                )
                if (res.data.success) {
                    setFeesData(res.data.feesData)
                }
            } catch (error) {
                console.log(error)
            }
        })()
    }, [])

    const renderRow = (item: Fee) => (
        <tr
            key={item.fee_id}
            className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-mrxPurpleLight"
        >
            <td className="hidden md:table-cell">{item.fee_id}</td>
            <td className="">{moment.utc(item.date).local().format('YYYY-MM-DD')}</td>
            <td className="">{item.fee}</td>
            <td className="hidden md:table-cell">{item.description}</td>
        </tr>
    )

    if (feesData.length > 0) {
        return (
            <div>
                {/* LIST */}
                <Table
                    columns={columns}
                    renderRow={renderRow}
                    data={feesData}
                    recordFerPage={recordFerPage}
                    page={page}
                />
                {/* PAGINATION */}
                <Pagination
                    rowCount={feesData.length}
                    recordFerPage={recordFerPage}
                    page={page}
                    setPage={setPage}
                />
            </div>
        )
    }

    if (feesData.length === 0) {
        return <div>No unpaid fee found for this member</div>
    }
}

export default UnpaidFees
