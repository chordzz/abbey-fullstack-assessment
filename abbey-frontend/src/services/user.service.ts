import axiosInstance from "@/lib/api/axios";


export const userService = {

    async getProfile() {
        const response = await axiosInstance.get('/users/profile')
        return response.data
    },

    async updateProfile(userData: {
        name?: string;
        bio?: string;
        address?: string;
        avatar_url?: string;
    }) {
        const response = await axiosInstance.patch('/users/profile', userData);
        return response.data;
    },

    async getAllUsers(params?: {
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const response = await axiosInstance.get('/users/all', { params });
        return response.data;
    },

    async getUserById(userId: string) {
        const response = await axiosInstance.get(`/users/${userId}`);
        return response.data;
    }

}