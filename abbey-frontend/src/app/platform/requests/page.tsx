'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SentRequests from "@/components/friends/sent-requests"
import ReceivedRequests from "@/components/friends/received-requests"

export default function RequestsPage() {

    const tabs = [
        {
            name: 'received',
            label: 'Received',
        },
        {
            name: 'sent',
            label: 'Sent',
        },
    ]

    return (
        <div className="p-4 lg:p-8 w-full h-full overflow-auto">
            <div className="w-[95%] max-w-[1137px] 2xl:max-w-full mx-auto">
                <h2 className="heading-3 text-[#232323] font-medium mb-1">Friend Requests</h2>
                <p className="text-[#373636] body-small mb-6">Manage your friend requests</p>

                <Tabs defaultValue="received" className="w-full">
                    <TabsList className="h-[38px] p-0 bg-transparent rounded-none mb-4">
                        {
                            tabs.map((tab, idx) => (
                                <TabsTrigger
                                    key={`${idx}-${tab}`}
                                    value={tab.name}
                                    className="rounded-none px-4 py-1.5 data-[state=active]:font-semibold data-[state=active]:bg-transparent data-[state=active]:border-b data-[state=active]:border-b-[#191919] data-[state=active]:text-[#191919] data-[state=active]:shadow-none data-[state=inactive]:text-[#98A2B3] transition body-small"
                                >
                                    {tab.label}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    
                    <TabsContent value="received">
                        <ReceivedRequests />
                    </TabsContent>
                    
                    <TabsContent value="sent">
                        <SentRequests />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
