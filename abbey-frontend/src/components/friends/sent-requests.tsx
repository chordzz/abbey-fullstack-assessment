/* eslint-disable @typescript-eslint/no-explicit-any */

import { LoaderCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { friendService } from "@/services/friend.service"
import { toast } from "sonner"

interface SentRequest {
    id: string
    email: string
    name: string
    bio: string | null
    avatar_url: string | null
    friendship_id: string
    request_date: string
}

export default function SentRequests() {
    const [requests, setRequests] = useState<SentRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [cancelLoading, setCancelLoading] = useState<string | null>(null)

    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        try {
            setLoading(true)
            const response = await friendService.getSentRequests()
            setRequests(response.sentRequests || [])
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load sent requests')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (friendshipId: string) => {
        try {
            setCancelLoading(friendshipId)
            await friendService.cancelFriendRequest(friendshipId)
            toast.success('Friend request cancelled')
            await fetchRequests()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to cancel request')
        } finally {
            setCancelLoading(null)
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
                No sent friend requests
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
                        <div className="w-12 h-12 flex-shrink-0 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {getInitials(request.name)}
                            </span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-medium text-[#232323] body-base truncate">{request.name}</h3>
                            <p className="text-[#393E46] body-small truncate">{request.email}</p>
                            {request.bio && <p className="text-[#98A2B3] text-xs truncate">{request.bio}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:flex-shrink-0">
                        <button 
                            onClick={() => handleCancel(request.friendship_id)}
                            disabled={cancelLoading === request.friendship_id}
                            className="flex-1 sm:flex-none px-4 py-2 rounded-full border border-gray-300 bg-white text-[#232323] body-small font-medium hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                        >
                            {cancelLoading === request.friendship_id && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Cancel Request
                        </button>
                        <button className="hidden sm:block px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors whitespace-nowrap">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}
