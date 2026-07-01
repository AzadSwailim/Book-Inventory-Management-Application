const activityService = require("../services/activity.service");

const getActivities = async (req, res) => {
    const { search, action } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const order = req.query.order === "asc" ? "asc" : "desc";

    const activities = await activityService.getActivities(
        search,
        action,
        page,
        limit,
        order
    );

    return res.json(activities);
};

module.exports = {
    getActivities
};
