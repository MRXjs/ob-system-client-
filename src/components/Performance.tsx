'use client'
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer } from 'recharts'

type Props = {
    attendancePercentage: number
    contributePercentage: number
    paidPercentage: number
}

const Performance = ({ attendancePercentage, contributePercentage, paidPercentage }: Props) => {
    const [data, setData] = useState<any[]>()

    useEffect(() => {
        const numerator = attendancePercentage + contributePercentage + paidPercentage
        const percentage = Math.round((numerator / 300) * 100)
        setData([
            { name: 'Group A', value: percentage, fill: '#C3EBFA' },
            { name: 'Group B', value: 100 - percentage, fill: '#FAE27C' },
        ])
    }, [attendancePercentage, contributePercentage, paidPercentage])

    return (
        <div className="bg-white p-4 rounded-md h-80 relative">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Performance</h1>
                <Image src={'/moreDart.png'} alt="" width={16} height={16} />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        dataKey="value"
                        startAngle={180}
                        endAngle={0}
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={70}
                        fill="#8884d8"
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <h1 className="text-3xl font-bold">{`${data?.[0].value}%`}</h1>
                <p className="text-xs text-gray-300">of 100 max AEF</p>
            </div>
            <h2 className="font-medium absolute bottom-16 left-0 right-0 m-auto text-center">
                {moment().format('dddd, MMMM Do YYYY')}
            </h2>
        </div>
    )
}

export default Performance
