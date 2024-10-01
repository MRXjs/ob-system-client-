'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AbsentMeetings from './shortcuts/AbsentMeetings'

type Props = {
    type: 'Absence meeting' | 'Not Contribute event' | 'Unpaid fees'
    id?: number | string
}

const ShortCutModel = ({ type, id }: Props) => {
    const [open, setOpen] = useState(false)

    // Add event listener for the Escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false)
            }
        }

        if (open) {
            document.addEventListener('keydown', handleEsc)
        }

        return () => {
            document.removeEventListener('keydown', handleEsc) // Cleanup on unmount
        }
    }, [open])

    const buttonText = {
        'Absence meeting': 'Absent meetings',
        'Not Contribute event': 'Not Contribute event',
        'Unpaid fees': 'Unpaid fees',
    }

    const buttonStyles = {
        'Absence meeting': 'bg-mrxSky',
        'Not Contribute event': 'bg-mrxPurpleLight',
        'Unpaid fees': 'bg-mrxYellowLight',
    }

    const renderButton = () => (
        <div
            onClick={() => setOpen(true)}
            className={`cursor-pointer p-3 rounded-md ${buttonStyles[type]}`}
        >
            {buttonText[type]}
        </div>
    )

    const renderModalContent = () => {
        if (type === 'Absence meeting') {
            return <AbsentMeetings />
        }

        if (type === 'Not Contribute event') {
            return <div>Sample test</div>
        }

        if (type === 'Unpaid fees') {
            return <div>Sample test</div>
        }
        return null
    }

    const renderModal = () =>
        open && (
            <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
                    {renderModalContent()}
                    <div
                        onClick={() => setOpen(false)}
                        className="absolute top-4 right-4 cursor-pointer"
                    >
                        <Image src={'/close.png'} alt="" width={14} height={14} />
                    </div>
                </div>
            </div>
        )

    return (
        <>
            {renderButton()}
            {renderModal()}
        </>
    )
}

export default ShortCutModel
