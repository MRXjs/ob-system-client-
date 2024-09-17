'use client'
import axios from 'axios'
import Image from 'next/image'
import React, { PureComponent, useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa'
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts'

const style = {
    top: '50%',
    right: 0,
    transform: 'translate(0, -50%)',
    lineHeight: '24px',
}

type Props = {}

const CountChart = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState({}) as any

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/member-gender-percentages`,
                    { withCredentials: true },
                )

                if (res.data.success) {
                    setData(res.data.genderData)
                }
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        })()
    }, [])

    return (
        <div className="bg-white rounded-xl w-full h-full p-4">
            {/* TITLE */}
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold">Members</h1>
                <Image src={'/moreDark.png'} alt="" width={20} height={20} />
            </div>
            {/* CHART */}
            <div className="relative w-full h-[75%]">
                <ResponsiveContainer>
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="40%"
                        outerRadius="100%"
                        barSize={32}
                        data={[
                            {
                                name: 'Total',
                                count: data?.female?.count + data?.male?.count,
                                fill: 'white',
                            },
                            {
                                name: 'Female',
                                count: data?.female?.count,
                                fill: '#FAE27C',
                            },
                            {
                                name: 'Male',
                                count: data?.male?.count,
                                fill: '#C3EBFA',
                            },
                        ]}
                    >
                        <RadialBar background dataKey="count" />
                    </RadialBarChart>
                </ResponsiveContainer>
                <Image
                    src={'/maleFemale.png'}
                    alt=""
                    width={50}
                    height={50}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                />
            </div>
            {/* BOTTOM */}
            <div className="flex justify-center gap-16">
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-mrxSky rounded-full" />
                    <h1 className="font-bold">
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-6 w-6 mr-3 text-green-600 inline-block" />
                        ) : (
                            data?.male?.count
                        )}
                    </h1>
                    <h2 className="text-xs text-gray-300">
                        Male (
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-6 w-6 mr-3 text-green-600 inline-block" />
                        ) : (
                            data?.male?.percentage
                        )}
                        %)
                    </h2>
                </div>
                <div className="flex flex-col gap-1">
                    <div className="w-5 h-5 bg-mrxYellow rounded-full" />
                    <h1 className="font-bold">
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-6 w-6 mr-3 text-green-600 inline-block" />
                        ) : (
                            data?.female?.count
                        )}
                    </h1>
                    <h2 className="text-xs text-gray-300">
                        Female (
                        {isLoading ? (
                            <FaSpinner className="animate-spin h-6 w-6 mr-3 text-green-600 inline-block" />
                        ) : (
                            data?.female?.percentage
                        )}
                        %)
                    </h2>
                </div>
            </div>
        </div>
    )
}

export default CountChart
