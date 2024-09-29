'use client'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'

type Props = {
    type: String
}

const UserCard = ({ type }: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [count, setCount] = useState(0)
    const currentDate = moment().format('YYYY/MM/DD')

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/${
                        type === 'membership fee' ? 'membership-fee' : type
                    }-count`,
                    { withCredentials: true },
                )

                res.data.success && setCount(res.data.rowCount)
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        })()
    }, [type])

    return (
        <div className="rounded-2xl odd:bg-mrxPurple even:bg-mrxYellow p-4 flex-1 min-w-[130px]">
            <div className="flex justify-between items-center">
                <span className="text-[10px] bg-white px-2 py-1 rounded-full text-green-600">
                    {currentDate}
                </span>
                <Image src="/more.png" alt="" width={20} height={20} />
            </div>
            <h1 className="text-2xl font-semibold my-4">
                {isLoading ? <FaSpinner className="animate-spin h-6 w-6 mr-3" /> : count}
            </h1>
            <h2 className="capitalize text-sm font-medium text-gray-500">{`${type}s`}</h2>
        </div>
    )
}

export default UserCard
