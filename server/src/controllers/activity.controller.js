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

const deleteActivity = async (req, res) => {
    const id = parseInt(req.params.id);
    const deletedActivity = await activityService.deleteActivity(id);

    if (!deletedActivity) {
        return res.status(404).json({
            message: "Activity log not found",
        });
    }

    return res.json({
        message: "Activity log deleted successfully",
    });
};

module.exports = {
    getActivities,
    deleteActivity
};
