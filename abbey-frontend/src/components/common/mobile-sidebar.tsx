"use client"

import { Home, Users, UserPlus, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const router = useRouter()

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

    const handleNavigate = (url: string) => {
        router.push(url)
        onClose()
    }

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent side="left" className="w-[280px] p-0">
                <SheetHeader className="px-6 py-4 border-b border-[#F4F4F4]">
                    <SheetTitle className="text-[#232323] body-base font-semibold">Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4 px-6 flex flex-col gap-2">
                    {sidebarItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigate(item.url)}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F6F7F9] cursor-pointer transition-colors"
                        >
                            <div className="text-[#393E46]">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="body-small font-medium text-[#232323]">{item.text}</span>
                        </button>
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}