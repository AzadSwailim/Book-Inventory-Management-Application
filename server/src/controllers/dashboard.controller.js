const dashboardService = require("../services/dashboard.services");

const getDashboard = async (req, res) => {
    const dashboard = await dashboardService.getDashboard();

    return res.json(dashboard);
};

module.exports = {
    getDashboard
};