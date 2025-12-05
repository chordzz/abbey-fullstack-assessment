


"use client"

import { TbMenu3 } from "react-icons/tb"
import { useState } from "react"
import UserAvatar from "@/components/common/user-avatar"
import Sidebar from "@/components/common/sidebar"
import MobileSidebar from "@/components/common/mobile-sidebar"


export default function PlatformLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    return (
        <div className="w-screen h-screen flex flex-col overflow-hidden">
            <div className="h-[72px] border-b border-[#F4F4F4] px-6 py-4 flex items-center justify-between">
                <div className="lg:hidden">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <TbMenu3 className="w-6 h-6 text-[#292D32]" />
                    </button>
                </div>

                <div className="w-full flex justify-end">
                    <UserAvatar />
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                
                <Sidebar />
                <MobileSidebar 
                    isOpen={isMobileSidebarOpen} 
                    onClose={() => setIsMobileSidebarOpen(false)} 
                />

                <div className="flex-1 flex overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}