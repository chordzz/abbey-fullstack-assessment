

"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { tokenStorage } from "@/lib/api/axios"
import { toast } from "sonner"

export default function UserAvatar() {
    const router = useRouter()

    const handleLogout = () => {
        tokenStorage.clearTokens()
        toast.success("Logged out successfully")
        router.push('/auth/signin')
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center cursor-pointer">
                    <span className="text-lg font-medium text-white">U</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-56 card-padding-sm" align="end">
                <div className="text-sm text-gray-700">
                    <div className="">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center spacing-md px-3 py-2 body-smaller text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                        >
                            <LogOut className="icon-sm" />
                            Log out
                        </button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}