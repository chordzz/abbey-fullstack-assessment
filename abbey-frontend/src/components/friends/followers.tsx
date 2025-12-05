/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { followerService } from "@/services/follower.service"
import { toast } from "sonner"

interface Follower {
    id: number
    email: string
    name: string
    bio: string
    avatar_url: string
    created_at: string
    followed_date: string
    friends_count: string
    followers_count: string
    is_following_back: boolean
    friendship_status: string | null
}

export default function Followers() {
    const [followers, setFollowers] = useState<Follower[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchFollowers()
    }, [])

    const fetchFollowers = async () => {
        try {
            setLoading(true)
            const data = await followerService.getFollowers()
            setFollowers(data.followers)
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch followers")
        } finally {
            setLoading(false)
        }
    }

    const handleRemoveFollower = async (followerId: string) => {
        try {
            await followerService.removeFollower(followerId)
            toast.success("Follower removed")
            fetchFollowers()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to remove follower")
        }
    }

    const handleFollowBack = async (followerId: string) => {
        try {
            await followerService.followUser(followerId)
            toast.success("Now following")
            fetchFollowers()
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to follow back")
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">Loading followers...</p>
            </div>
        )
    }

    if (followers.length === 0) {
        return (
            <div className="flex items-center justify-center py-12">
                <p className="text-[#98A2B3] body-base">No followers yet</p>
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {followers.map((follower) => (
                <div 
                    key={follower.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {follower.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-[#232323] body-base truncate">{follower.name}</h3>
                            <p className="text-[#393E46] body-small truncate">{follower.email}</p>
                            {follower.is_following_back && (
                                <p className="text-[#98A2B3] text-xs">Following you back</p>
                            )}
                            {follower.friendship_status === 'accepted' && (
                                <p className="text-[#98A2B3] text-xs">Friends</p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2 sm:flex-shrink-0">
                        {!follower.is_following_back && (
                            <button 
                                onClick={() => handleFollowBack(follower.id.toString())}
                                className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors whitespace-nowrap"
                            >
                                Follow Back
                            </button>
                        )}
                        <button 
                            onClick={() => handleRemoveFollower(follower.id.toString())}
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