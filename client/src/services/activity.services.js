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
