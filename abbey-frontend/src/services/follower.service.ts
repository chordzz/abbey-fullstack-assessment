import axiosInstance from "@/lib/api/axios";

export const followerService = {

    async getFollowers() {
        const response = await axiosInstance.get('/followers');
        return response.data;
    },

    async getFollowing() {
        const response = await axiosInstance.get('/followers/following');
        return response.data;
    },

    async getFollowerStats() {
        const response = await axiosInstance.get('/followers/stats');
        return response.data;
    },

    async followUser(userId: string) {
        const response = await axiosInstance.post('/followers/follow', { followingId: userId });
        return response.data;
    },

    async unfollowUser(userId: string) {
        const response = await axiosInstance.delete(`/followers/unfollow/${userId}`);
        return response.data;
    },

    async removeFollower(userId: string) {
        const response = await axiosInstance.delete(`/followers/remove/${userId}`);
        return response.data;
    }

}