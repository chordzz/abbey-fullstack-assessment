/* eslint-disable @typescript-eslint/no-explicit-any */

import { Check, X, LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { friendService } from "@/services/friend.service"
import { toast } from "sonner"

interface ReceivedRequest {
    id: string
    email: string
    name: string
    bio: string | null
    avatar_url: string | null
    friendship_id: string
    request_date: string
    friends_count: string
    followers_count: string
}

export default function ReceivedRequests() {
    const [requests, setRequests] = useState<ReceivedRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const response = await friendService.getFriendRequests()
            setRequests(response.requests || [])
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load requests')
        } finally {
            setLoading(false)
        }
    }

    const handleAccept = async (friendshipId: string) => {
        try {
            setActionLoading(friendshipId)
            await friendService.acceptFriendRequest(friendshipId)
            toast.success('Friend request accepted!')
            await fetchRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to accept request')
        } finally {
            setActionLoading(null)
        }
    }

    const handleReject = async (friendshipId: string) => {
        try {
            setActionLoading(friendshipId)
            await friendService.rejectFriendRequest(friendshipId)
            toast.success('Friend request rejected')
            await fetchRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to reject request')
        } finally {
            setActionLoading(null)
        }
    }

    const getInitials = (name: string) => {
        const parts = name.split(' ')
        return `${parts[0]?.charAt(0) || ''}${parts[1]?.charAt(0) || ''}`.toUpperCase()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    if (requests.length === 0) {
        return (
            <div className="text-center p-8 text-[#98A2B3]">
                No pending friend requests
            </div>
        )
    }

    return (
        <div className="space-y-3">
            {requests.map((request) => (
                <div 
                    key={request.friendship_id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors gap-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {getInitials(request.name)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-[#232323] body-base truncate">{request.name}</h3>
                            <p className="text-[#393E46] body-small truncate">{request.email}</p>
                            <p className="text-[#98A2B3] text-xs">{request.friends_count} friends · {request.followers_count} followers</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => handleAccept(request.friendship_id)}
                            disabled={actionLoading === request.friendship_id}
                            className="w-10 h-10 shrink-0 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {actionLoading === request.friendship_id ? (
                                <LoaderCircle className="w-5 h-5 animate-spin" />
                            ) : (
                                <Check className="w-5 h-5" />
                            )}
                        </button>
                        <button 
                            onClick={() => handleReject(request.friendship_id)}
                            disabled={actionLoading === request.friendship_id}
                            className="w-10 h-10 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <button className=" px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors whitespace-nowrap">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
