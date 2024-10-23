import { getDashboardData } from "../services/dashboard_service.js";

export const handleGetDashboardData = async (req, res) => {
  try {
    const dashboardData = await getDashboardData();
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
