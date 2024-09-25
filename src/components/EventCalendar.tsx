'use client'
import axios from 'axios'
import moment from 'moment'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

type Props = {}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

// TEMPORARY
// const events = [
//     {
//         id: 1,
//         title: 'Lorem ipsum dolor',
//         time: '12:00 PM - 2:00 PM',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     },
//     {
//         id: 2,
//         title: 'Lorem ipsum dolor',
//         time: '12:00 PM - 2:00 PM',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     },
//     {
//         id: 3,
//         title: 'Lorem ipsum dolor',
//         time: '12:00 PM - 2:00 PM',
//         description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
//     },
// ]

const EventCalendar = (props: Props) => {
    const [value, onChange] = useState<Value>(new Date())
    const [isLoading, setIsLoading] = useState(false)
    const [events, setEvents] = useState([])

    useEffect(() => {
        ;(async () => {
            setIsLoading(true)
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/latest-events`,
                    { withCredentials: true },
                )

                if (res.data.success) {
                    setEvents(res.data.eventData)
                }
            } catch (error) {
                console.log(error)
            }
            setIsLoading(false)
        })()
    }, [])

    return (
        <div className="bg-white p-4 rounded-md">
            <Calendar onChange={onChange} value={value} />
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold my-4">Events</h1>
                <Image src={'/moreDark.png'} alt="" width={20} height={20} />
            </div>
            <div className="flex flex-col gap-4">
                {events.map((event: any) => (
                    <div
                        className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-mrxSky even:border-t-mrxPurple"
                        key={event.event_id}
                    >
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold text-gray-600">{event.name}</h1>
                            <span className="text-gray-300 text-xs">
                                {' '}
                                {moment.utc(event.date).local().format('YYYY-MM-DD')}
                            </span>
                        </div>
                        <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default EventCalendar
