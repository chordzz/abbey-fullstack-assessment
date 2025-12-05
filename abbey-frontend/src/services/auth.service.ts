

import axiosInstance from "@/lib/api/axios";

export const authService = {

    async signin(email: string, password: string) {
        const response = await axiosInstance.post('/auth/signin', { email, password });
        return response.data;
    },

    async signup(userData: {
        name: string;
        email: string;
        password: string;
        address?: string;
        bio?: string;
    }) {
        const response = await axiosInstance.post('/auth/signup', userData);
        return response;
    }
}