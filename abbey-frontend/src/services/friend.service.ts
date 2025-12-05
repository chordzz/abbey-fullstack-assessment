

import axiosInstance from "@/lib/api/axios";

export const friendService = {

    async getFriends() {
        const response = await axiosInstance.get('/friends');
        return response.data;
    },

    async getFriendRequests() {
        const response = await axiosInstance.get('/friends/requests');
        return response.data;
    },

    async getSentRequests() {
        const response = await axiosInstance.get('/friends/requests/sent');
        return response.data;
    },

    async sendFriendRequest(friendId: string) {
        const response = await axiosInstance.post('/friends/request', { friendId });
        return response.data;
    },

    async acceptFriendRequest(friendshipId: string) {
        const response = await axiosInstance.patch(`/friends/accept/${friendshipId}`);
        return response.data;
    },

    async rejectFriendRequest(friendshipId: string) {
        const response = await axiosInstance.patch(`/friends/reject/${friendshipId}`);
        return response.data;
    },

    async cancelFriendRequest(friendshipId: string) {
        const response = await axiosInstance.delete(`/friends/cancel/${friendshipId}`);
        return response.data;
    },

    async removeFriend(friendId: string) {
        const response = await axiosInstance.delete(`/friends/${friendId}`);
        return response.data;
    }
}