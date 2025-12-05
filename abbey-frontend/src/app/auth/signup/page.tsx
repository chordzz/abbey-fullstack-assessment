/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LoaderCircle } from "lucide-react"
import { authService } from "@/services/auth.service"
import { tokenStorage } from "@/lib/api/axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"


export default function SignUpPage() {
    const [ firstName, setFirstName ] = useState('')
    const [ lastName, setLastName ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ confirmPassword, setConfirmPassword ] = useState('')
    const [ address, setAddress ] = useState('')
    const [ bio, setBio ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setLoading(true)

        try {
            const userData = {
                name: `${firstName} ${lastName}`,
                email,
                password,
                ...(address && { address }),
                ...(bio && { bio })
            }

            const response = await authService.signup(userData)
            tokenStorage.setTokens(response.data.token)
            // console.log("User data: ", userData)
            toast.success('Account created successfully!')
            router.push('/platform/home')
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Signup failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className="heading-3 text-[#232323] leading-[120%]">
                    Create Your Account
                </h1>

                <p className="body-small text-[#393E46] mt-1">
                    Join Abbey Microfinance today.
                </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 my-8">
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
            </div>

            <div className="grid w-full items-center gap-1 my-8">
                <Label htmlFor="email" className="text-[#232323] font-medium body-small">Email Address</Label>
                <Input 
                    required
                    type="email" 
                    id="email" 
                    placeholder="Enter email address" 
                    className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                />
            </div>

            <div className="grid grid-cols-2 gap-4 my-8">
                <div className="grid w-full items-center gap-1">
                    <Label htmlFor="password" className="text-[#232323] font-medium body-small">Password</Label>
                    <Input 
                        required
                        type="password" 
                        id="password" 
                        placeholder="Enter password" 
                        className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                    />
                </div>

                <div className="grid w-full items-center gap-1">
                    <Label htmlFor="confirmPassword" className="text-[#232323] font-medium body-small">Confirm Password</Label>
                    <Input 
                        required
                        type="password" 
                        id="confirmPassword" 
                        placeholder="Confirm password" 
                        className="border border-[#ECEDEE] rounded-xl bg-[#F6F7F9] h-14 placeholder:body-base placeholder:text-[#98A2B3] text-sm! shadow-none focus-visible:border-[#000000] focus-visible:ring-0" 
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                    />
                </div>
            </div>

            <div className="grid w-full items-center gap-1 my-8">
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

            <div className="grid w-full items-center gap-1 my-8">
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

            <div>
                <Button disabled={!email || !firstName || !lastName || !password || !confirmPassword || loading} type="submit" className="rounded-[35px] h-[52px] bg-[#000000] disabled:bg-[#DFDFDF] text-white font-bold btn-text-large w-full shadow-none">
                    {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Create Account
                </Button>
            </div>
        </form>
    )
}
