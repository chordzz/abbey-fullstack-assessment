/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { userService } from "@/services/user.service"
import { friendService } from "@/services/friend.service"
import { followerService } from "@/services/follower.service"
import { toast } from "sonner"
import { LoaderCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface User {
    id: string
    email: string
    name: string
    bio: string | null
    avatar_url: string | null
    created_at: string
    friends_count: string
    followers_count: string
    friendship_status: string
    is_following: boolean
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            setLoading(true)
            const response = await userService.getAllUsers()
            setUsers(response.users || [])
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to fetch users")
        } finally {
            setLoading(false)
        }
    }

    const handleSendFriendRequest = async (userId: string) => {
        try {
            setActionLoading(userId)
            await friendService.sendFriendRequest(userId)
            toast.success("Friend request sent")
            await fetchUsers() // Refresh the users list to update button states
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to send friend request")
        } finally {
            setActionLoading(null)
        }
    }

    const handleFollow = async (userId: string) => {
        try {
            setActionLoading(userId)
            await followerService.followUser(userId)
            toast.success("Now following")
            await fetchUsers() // Refresh the users list to update button states
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to follow user")
        } finally {
            setActionLoading(null)
        }
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase()
    }

    return (
        <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-[#232323] mb-4">All Users</h1>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <LoaderCircle className="w-8 h-8 animate-spin text-[#98A2B3]" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <p className="text-[#98A2B3] body-base">
                            {"No users available"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {users.map((user) => (
                            <div 
                                key={user.id} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors gap-4"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                                        <span className="font-semibold text-[#232323] text-sm">
                                            {getInitials(user.name)}
                                        </span>
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-medium text-[#232323] body-base truncate">{user.name}</h3>
                                        <p className="text-[#393E46] body-small truncate">{user.email}</p>
                                        <p className="text-[#98A2B3] text-xs">
                                            {user.friends_count} friends · {user.followers_count} followers
                                        </p>
                                        {user.bio && <p className="text-[#98A2B3] text-xs truncate">{user.bio}</p>}
                                    </div>
                                </div>
                                <div className="flex gap-2 sm:shrink-0">
                                    <button 
                                        onClick={() => handleFollow(user.id)}
                                        disabled={
                                            (actionLoading === user.id) ||
                                            user.is_following
                                        }
                                        className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-[#ECEDEE] text-[#232323] body-small font-medium hover:bg-[#F6F7F9] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {actionLoading === user.id && <LoaderCircle className="w-4 h-4 animate-spin" />}
                                        {
                                            user.is_following ? "Following!" : "Follow" 
                                        }
                                    </button>
                                    <button 
                                        onClick={() => handleSendFriendRequest(user.id)}
                                        disabled={
                                            (actionLoading === user.id) ||
                                            (user.friendship_status === 'accepted') ||
                                            (user.friendship_status === 'pending')
                                        }
                                        className="flex-1 sm:flex-none px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                                    >
                                        {actionLoading === user.id && <LoaderCircle className="w-4 h-4 animate-spin" />}
                                        {
                                            user.friendship_status === 'accepted' ? 
                                                "Friends" : (
                                                    user.friendship_status === 'pending' ? "Pending" : "Add friend"
                                                )
                                        }
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
