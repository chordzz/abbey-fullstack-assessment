import { Check, X } from "lucide-react"

const mockRequests = [
    {
        id: 1,
        name: "Alex Johnson",
        email: "alex.johnson@gmail.com",
        avatar: "AJ",
        mutualFriends: 5
    },
    {
        id: 2,
        name: "Maya Patel",
        email: "maya.patel@gmail.com",
        avatar: "MP",
        mutualFriends: 14
    },
    {
        id: 3,
        name: "Ryan O'Connor",
        email: "ryan.oconnor@gmail.com",
        avatar: "RO",
        mutualFriends: 3
    },
    {
        id: 4,
        name: "Zara Ahmed",
        email: "zara.ahmed@gmail.com",
        avatar: "ZA",
        mutualFriends: 17
    },
    {
        id: 5,
        name: "Lucas Silva",
        email: "lucas.silva@gmail.com",
        avatar: "LS",
        mutualFriends: 6
    }
]

export default function Requests() {

    return (
        <div className="space-y-3">
            {mockRequests.map((request) => (
                <div 
                    key={request.id} 
                    className="flex items-center justify-between p-4 border border-[#ECEDEE] rounded-xl bg-white hover:bg-[#F6F7F9] transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-[#F6F7F9] border border-[#ECEDEE] flex items-center justify-center">
                            <span className="font-semibold text-[#232323] text-sm">
                                {request.avatar}
                            </span>
                        </div>
                        <div>
                            <h3 className="font-medium text-[#232323] body-base">{request.name}</h3>
                            <p className="text-[#393E46] body-small">{request.email}</p>
                            <p className="text-[#98A2B3] text-xs">{request.mutualFriends} mutual friends</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition-colors">
                            <Check className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                        <button className="px-4 py-2 rounded-full bg-[#000000] text-white body-small font-medium hover:bg-[#232323] transition-colors">
                            View Profile
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}