

import { Home, Users, UserPlus, UserCheck } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {

    const sidebarItems = [
        {
            icon: Home,
            text: 'Home',
            url: '/platform/home',
        },
        {
            icon: Users,
            text: 'Friends',
            url: '/platform/friends',
        },
        {
            icon: UserCheck,
            text: 'Requests',
            url: '/platform/requests',
        },
        {
            icon: UserPlus,
            text: 'All Users',
            url: '/platform/users',
        },
    ]

    return (
        <div className="hidden w-[200px] lg:flex py-4 px-6 flex-col gap-2 border-r border-[#F4F4F4]">
                    
            {
                sidebarItems.map((item, index) => (
                    <Link 
                        key={index} 
                        href={item.url}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F6F7F9] cursor-pointer transition-colors"
                    >
                        <div className="text-[#393E46]">
                            {<item.icon className="w-5 h-5" />}
                        </div>
                        <span className="body-small font-medium text-[#232323]">{item.text}</span>
                    </Link>
                ))
            }

        </div>
    )
}