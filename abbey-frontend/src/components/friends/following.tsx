/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { followerService } from "@/services/follower.service"
import { toast } from "sonner"

interface Following {
    id: string
    email: string
    name: string
    bio: string
    avatar_url: string | null
    created_at: string
    followed_date: string
    friends_count: string
    followers_count: string
    follows_you_back: boolean
    friendship_status: string | null
}

export default function Following() {
    const [following, setFollowing] = useState<Following[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFollowing()
    }, [])

    const fetchFollowing = async () => {
        try {
            setLoading(true)
            const data = await followerService.getFollowing()
            setFollowing(data.following)
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch following")
        } finally {
            setLoading(false)
        }
    }

    const handleUnfollow = async (followingId: string) => {
        try {
            await followerService.unfollowUser(followingId)
            toast.success("Unfollowed successfully")
            fetchFollowing()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to unfollow")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">Loading following...</p>
            </div>
        )
    }

    if (following.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">Not following anyone yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {following.map((person) => (
                <div 
                    key={person.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {person.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-[#232323] body-base truncate">{person.name}</h3>
                            <p className="text-[#393E46] body-small truncate">{person.email}</p>
                            {person.follows_you_back && (
                                <p className="text-[#98A2B3] text-xs">Follows you back</p>
                            )}
                            {person.friendship_status === 'accepted' && (
                                <p className="text-[#98A2B3] text-xs">Friends</p>
                            )}
                        </div>
                    </div>
                    <button 
                        onClick={() => handleUnfollow(person.id)}
                        className="sm:flex-shrink-0 px-4 py-2 rounded-full border border-[#ECEDEE] text-[#232323] body-small font-medium hover:bg-[#F6F7F9] transition-colors whitespace-nowrap"
                    >
                        Unfollow
                    </button>
                </div>
            ))}
        </div>
    )
}