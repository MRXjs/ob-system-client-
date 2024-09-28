'use client'
import FormModal from '@/components/FormModal'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'
import TableSearch from '@/components/TableSearch'
import { role } from '@/lib/data'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

type Props = {}

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

const FeesPage = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [feesData, setFeesData] = useState<Fee[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    useEffect(() => {
        ;(async () => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/membership-fees`,
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
            <td>
                <div className="flex items-center gap-2">
                    <FormModal
                        table="fee"
                        type="view"
                        id={item.fee_id}
                        data={{ date: item.date, description: item.description }}
                    />
                    <FormModal table="fee" type="update" data={item} />
                    {role === 'admin' && <FormModal table="fee" type="delete" id={item.fee_id} />}
                </div>
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">All Fees</h1>
                <div className="flex flex-col md:flex-row  items-center gap-4  w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4 self-end">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mrxYellow">
                            <Image src={'/filter.png'} alt="" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-mrxYellow">
                            <Image src={'/sort.png'} alt="" width={14} height={14} />
                        </button>
                        {role === 'admin' && <FormModal table="fee" type="create" />}
                    </div>
                </div>
            </div>
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

export default FeesPage
