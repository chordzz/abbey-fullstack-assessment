

import Followers from "@/components/friends/followers"
import Following from "@/components/friends/following"
import Friends from "@/components/friends/friends"
import Requests from "@/components/friends/requests"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FriendsPage() {

    const tabs = [
        {
            name: 'friends',
            label: 'Friends',
        },
        {
            name: 'following',
            label: 'Following',
        },
        {
            name: 'followers',
            label: 'Followers',
        },
        // {
        //     name: 'requests',
        //     label: 'Requests',
        // },
    ]

    return (
        <div className="p-4 lg:p-8 w-full h-full overflow-auto">
            <div className="w-[95%] max-w-[1137px] 2xl:max-w-full mx-auto flex flex-col gap-2 xl:gap-6 justify-between">
                {/* <h1 className="heading-2 mb-2">Friends</h1> */}

                <div>
                    <Tabs defaultValue="friends" className="w-full">
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

                        <TabsContent value="friends">
                            <Friends />
                        </TabsContent>

                        <TabsContent value="following">
                            <Following />
                        </TabsContent>

                        <TabsContent value="followers">
                            <Followers />
                        </TabsContent>

                        {/* <TabsContent value="requests">
                            <Requests />
                        </TabsContent> */}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}