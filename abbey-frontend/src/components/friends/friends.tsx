/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { friendService } from "@/services/friend.service"
import { toast } from "sonner"

interface Friend {
    id: string
    email: string
    name: string
    bio: string
    avatar_url: string | null
    created_at: string
    friends_count: string
    followers_count: string
    friendship_date: string
}

export default function Friends() {
    const [friends, setFriends] = useState<Friend[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFriends()
    }, [])

    const fetchFriends = async () => {
        try {
            setLoading(true)
            const data = await friendService.getFriends()
            setFriends(data.friends)
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch friends")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFriend = async (friendId: string) => {
        try {
            await friendService.removeFriend(friendId)
            toast.success("Friend removed")
            fetchFriends()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to remove friend")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">Loading friends...</p>
            </div>
        )
    }

    if (friends.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">No friends yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {friends.map((friend) => (
                <div 
                    key={friend.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {friend.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-[#232323] body-base truncate">{friend.name}</h3>
                            <p className="text-[#393E46] body-small truncate">{friend.email}</p>
                            <p className="text-[#98A2B3] text-xs">
                                Friends since {new Date(friend.friendship_date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 sm:shrink-0">
                        <button className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors whitespace-nowrap">
                            View Profile
                        </button>
                        <button 
                            onClick={() => handleRemoveFriend(friend.id)}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-[#ECEDEE] text-[#232323] body-small font-medium hover:bg-[#F6F7F9] transition-colors whitespace-nowrap"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}