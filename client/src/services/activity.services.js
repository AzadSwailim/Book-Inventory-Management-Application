import api from "../api/axios";

export const getActivities = async ({ search, action, order, page, limit }) => {
    const response = await api.get("/activity", {
        params: {
            search,
            action,
            order,
            page,
            limit
        }
    });
    return response.data;
};

export const deleteActivity = async (id) => {
    const response = await api.delete(`/activity/${id}`);
    return response.data;
};
