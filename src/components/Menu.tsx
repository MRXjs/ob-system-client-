import { role } from '@/lib/data'
import Image from 'next/image'
import Link from 'next/link'

const menuItems = [
    {
        title: 'MENU',
        items: [
            {
                icon: '/home.png',
                label: 'Dashboard',
                href: '/dashboard',
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
            {
                icon: '/student.png',
                label: 'Members',
                href: '/list/members',
                visible: ['admin', 'teacher'],
            },
            {
                icon: '/attendance.png',
                label: 'Meetings',
                href: '/list/meetings',
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
            {
                icon: '/calendar.png',
                label: 'Events',
                href: '/list/events',
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
            {
                icon: '/lesson.png',
                label: 'Lessons',
                href: '/list/lessons',
                visible: ['admin', 'teacher'],
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
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
            {
                icon: '/setting.png',
                label: 'Settings',
                href: '/settings',
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
            {
                icon: '/logout.png',
                label: 'Logout',
                href: '/',
                visible: ['admin', 'teacher', 'student', 'parent'],
            },
        ],
    },
]

type Props = {}

const Menu = (props: Props) => {
    return (
        <div className="mt-4 text-sm">
            {menuItems.map((i) => (
                <div key={i.title} className="flex flex-col gap-2">
                    <span className="hidden lg:block text-gray-400 font-light my-4">{i.title}</span>
                    {i.items.map((item: any) => {
                        if (item.visible.includes(role)) {
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-mrxSky"
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
