'use client'
import React, { useState } from 'react'

type Props = {}

type Member = {
    meeting_id: number
    date: string
    description: string
}

const AbsentMeetings = (props: Props) => {
    const [isLoading, setIsLoading] = useState(false)
    const [meetingsData, setMeetingsData] = useState<Member[]>([])

    // pagination
    const [page, setPage] = useState(1)
    const recordFerPage = 8

    return <div></div>
}

export default AbsentMeetings
