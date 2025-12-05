

/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { LoaderCircle } from "lucide-react"

import { userService } from '@/services/user.service'


export default function HomePage() {

    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ address, setAddress ] = useState('')
    const [ bio, setBio ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const [ fetching, setFetching ] = useState(true)
    const [ stats, setStats ] = useState({
        followers: 0,
        following: 0,
        friends: 0
    })

    useEffect(() => {
        fetchProfile()
    }, [])

    const fetchProfile = async () => {
        try {
            setFetching(true)
            const response = await userService.getProfile()
            const user = response.user
            
            // Split name into first and last name
            const nameParts = user.name?.split(' ') || []
            setFirstName(nameParts[0] || '')
            setLastName(nameParts.slice(1).join(' ') || '')
            
            setEmail(user.email || '')
            setAddress(user.address || '')
            setBio(user.bio || '')
            
            // Set stats
            setStats({
                followers: user.stats?.followers || 0,
                following: user.stats?.following || 0,
                friends: user.stats?.friends || 0
            })
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to load profile')
        } finally {
            setFetching(false)
        }
    }

    // const handleSubmit = async (e: React.FormEvent) => {
    const handleSubmit = async () => {
        // e.preventDefault()
        setLoading(true)

        try {
            const userData = {
                name: `${firstName.trim()} ${lastName.trim()}`.trim(),
                bio: bio.trim() || undefined,
                address: address.trim() || undefined
            }

            await userService.updateProfile(userData)
            toast.success('Profile updated successfully!')
            await fetchProfile()
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        fetchProfile()
    }

    const getInitials = () => {
        return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
    }

    if (fetching) {
        return (
            <div className="p-4 lg:p-8 w-full h-full overflow-auto flex items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="p-4 lg:p-8 w-full h-full overflow-auto">
            <div className="w-[95%] max-w-[1137px] 2xl:max-w-full mx-auto flex flex-col gap-2 xl:gap-6 justify-between">

                <div className="border-[0.8px] border-[#E6E6E6] rounded-[13px] p-4 md:p-8">

                    <h2 className="heading-3 text-[#232323] font-medium mb-1">Profile & Account</h2>
                    <p className="text-[#373636] body-small mb-6">Manage your personal information and account details</p>

                    <div className="flex justify-between items-center mb-5">
                        <div className="flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-[101.16px] h-[101.16px] rounded-full border justify-center items-center flex">
                                    <span className="text-2xl font-bold">
                                        {getInitials()}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-lg font-medium">{firstName} {lastName}</div>
                                    <div className="text-[#5A5A5A] body-small">{email}</div>
                                </div>
                            </div>
                            {/* <button
                                className="ml-0 md:ml-8 px-5 py-2 rounded-[34.09px] border border-[#EAEAEA] bg-[#F9F9F9] font-bold text-sm hover:bg-gray-50 transition"
                            >
                                Change Avatar
                            </button> */}
                        </div>

                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="body-smaller">{stats.followers}</span>
                                <span className="text-black body-small font-semibold">Followers</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="body-smaller">{stats.following}</span>
                                <span className="text-black body-small font-semibold">Following</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="body-smaller">{stats.friends}</span>
                                <span className="text-black body-small font-semibold">Friends</span>
                            </div>

                        </div>
                    </div>

                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="grid w-full items-center gap-1">
                            <Label htmlFor="firstName" className="text-[#232323] font-medium body-small">First Name</Label>
                            <Input 
                                required
                                type="text" 
                                id="firstName" 
                                placeholder="Enter first name" 
                                className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                                onChange={e => setFirstName(e.target.value)}
                                value={firstName}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1">
                            <Label htmlFor="lastName" className="text-[#232323] font-medium body-small">Last Name</Label>
                            <Input 
                                required
                                type="text" 
                                id="lastName" 
                                placeholder="Enter last name" 
                                className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                                onChange={e => setLastName(e.target.value)}
                                value={lastName}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1 lg:col-span-2">
                            <Label htmlFor="email" className="text-[#232323] font-medium body-small">Email Address</Label>
                            <Input 
                                disabled
                                type="email" 
                                id="email" 
                                placeholder="Enter email address" 
                                className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0 disabled:opacity-60 disabled:cursor-not-allowed" 
                                onChange={e => setEmail(e.target.value)}
                                value={email}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1 lg:col-span-2">
                            <Label htmlFor="address" className="text-[#232323] font-medium body-small">Address</Label>
                            <Input 
                                type="text" 
                                id="address" 
                                placeholder="Enter address (optional)" 
                                className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                                onChange={e => setAddress(e.target.value)}
                                value={address}
                            />
                        </div>

                        <div className="grid w-full items-center gap-1 lg:col-span-2">
                            <Label htmlFor="bio" className="text-[#232323] font-medium body-small">Bio</Label>
                            <Input 
                                type="text" 
                                id="bio" 
                                placeholder="Tell us about yourself (optional)" 
                                className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                                onChange={e => setBio(e.target.value)}
                                value={bio}
                            />
                        </div>
                    </form>

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="px-6 py-2 rounded-full border border-gray-300 bg-white font-medium text-base hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loading || !firstName || !lastName}
                            className="px-6 py-2 rounded-full bg-black text-white font-medium text-base hover:bg-gray-900 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}