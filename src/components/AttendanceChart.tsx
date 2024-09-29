'use client'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'

type Props = {}

// const data = [
//     {
//         date: '2024-01-21',
//         present: 60,
//         absent: 40,
//     },
//     {
//         date: '2024-02-21',
//         present: 71,
//         absent: 60,
//     },
//     {
//         date: '2024-03-21',
//         present: 92,
//         absent: 75,
//     },
//     {
//         date: '2024-04-21',
//         present: 90,
//         absent: 75,
//     },
//     {
//         date: '2024-05-21',
//         present: 65,
//         absent: 55,
//     },
// ]

const AttendanceChart = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([])

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/meeting-attendance-percentage`,

                    { withCredentials: true },
                )
                if (res.data.success) {
                    const attendanceData = res.data.attendanceData
                    const dateConvert = attendanceData.map((meeting: any, index: number) => {
                        meeting.date = moment.utc(meeting.date).local().format('YYYY-MM-DD')
                        return meeting
                    })
                    setData(dateConvert)
                }
            } catch (error: any) {
                error?.response?.data.message && toast.error(error?.response?.data.message)
            }
            setIsLoading(false)
        })()
    }, [])

    return (
        <div className="bg-white rounded-lg p-4 h-full">
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-semibold"> Meetings attendance</h1>
                <Image src="/moreDark.png" alt="" width={20} height={20} />
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <BarChart width={500} height={300} data={data} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tick={{ fill: '#d1d5db' }}
                        tickLine={false}
                    />
                    <YAxis axisLine={false} tick={{ fill: '#d1d5db' }} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
                    <Legend
                        align="left"
                        verticalAlign="top"
                        wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
                    />
                    <Bar
                        dataKey="present"
                        fill="#FAE27C"
                        activeBar={<Rectangle fill="pink" stroke="blue" />}
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                    <Bar
                        dataKey="absent"
                        fill="#C3EBFA"
                        activeBar={<Rectangle fill="gold" stroke="purple" />}
                        legendType="circle"
                        radius={[10, 10, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default AttendanceChart
