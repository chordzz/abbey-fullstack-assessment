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


export default function SignInPage() {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await authService.signin(email, password)
            toast.success('Login successful!')
            tokenStorage.setTokens(response.token)
            router.push('/platform/home')
        } catch (error: any) {
            console.log("Error: ", error)
            toast.error(error.response?.data?.error || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h1 className="heading-3 text-[#232323] leading-[120%]">
                    Welcome to Abbey Microfinance
                </h1>

                <p className="body-small text-[#393E46] mt-1">
                    Secure access with your email and password.
                </p>
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

            <div className="grid w-full items-center gap-1 my-8">
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

            <div>
                <Button disabled={!email || loading || !password} type="submit" className="rounded-[35px] h-[52px] bg-[#000000] disabled:bg-[#DFDFDF] text-white font-bold btn-text-large w-full shadow-none">
                    {loading ? <LoaderCircle className="mr-2 h-5 w-5 animate-spin" /> : null}
                    Login
                </Button>
            </div>
        </form>
    )
}