'use client'
import { role } from '@/lib/data'
import { showNDMessage } from '@/lib/fuctions'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

const menuItems = [
    {
        title: 'MENU',
        items: [
            {
                icon: '/home.png',
                label: 'Dashboard',
                href: '/dashboard',
                visible: ['admin'],
            },
            {
                icon: '/student.png',
                label: 'Members',
                href: '/members',
                visible: ['admin'],
            },
            {
                icon: '/attendance.png',
                label: 'Meetings',
                href: '/meetings',
                visible: ['admin'],
            },
            {
                icon: '/calendar.png',
                label: 'Events',
                href: '/events',
                visible: ['admin'],
            },
            {
                icon: '/lesson.png',
                label: 'Fees',
                href: '/fees',
                visible: ['admin'],
            },
        ],
    },
    {
        title: 'OTHER',
        items: [
            {
                icon: '/profile.png',
                label: 'Profile',
                href: '/profile',
                visible: ['admin'],
            },
            {
                icon: '/setting.png',
                label: 'Settings',
                href: '/settings',
                visible: ['admin'],
            },
            {
                icon: '/logout.png',
                label: 'Logout',
                href: '/',
                visible: ['admin'],
            },
        ],
    },
]

type Props = {}

const Menu = (props: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_HOST}/api/v1/logout`, {
                withCredentials: true,
            })
            if (res.data.success) {
                toast.success(res.data.message)
                router.push('/')
            }
        } catch (error: any) {
            error?.response?.data.message && toast.error(error?.response?.data.message)
        }
    }

    return (
        <div className="mt-4 text-sm">
            {menuItems.map((i) => (
                <div key={i.title} className="flex flex-col gap-2">
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item: any) => {
                        if (item.visible.includes(role)) {
                            if (item.label === 'Logout') {
                                return (
                                    <div
                                        key={item.label}
                                        onClick={logoutHandler}
                                        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mrxSky cursor-pointer"
                                    >
                                        <Image src={item.icon} alt="" width={20} height={20} />
                                        <span className="hidden lg:block">{item.label}</span>
                                    </div>
                                )
                            }

                            if (item.label === 'Profile' || item.label === 'Settings') {
                                return (
                                    <div
                                        key={item.label}
                                        onClick={showNDMessage}
                                        className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mrxSky cursor-pointer"
                                    >
                                        <Image src={item.icon} alt="" width={20} height={20} />
                                        <span className="hidden lg:block">{item.label}</span>
                                    </div>
                                )
                            }

                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mrxSky ${
                                        pathname === item.href && 'bg-mrxSkyLight'
                                    }`}
                                >
                                    <Image src={item.icon} alt="" width={20} height={20} />
                                    <span className="hidden lg:block">{item.label}</span>
                                </Link>
                            )
                        }
                    })}
                </div>
            ))}
        </div>
    )
}

export default Menu
