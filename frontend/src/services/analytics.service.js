import axios from "axios";
import AuthService from "./auth.service";

const API_URL = "http://localhost:5000/analytics/";

const getAdminStats = () => {
    const user = AuthService.getCurrentUser();
    return axios.get(API_URL + "admin/stats", {
        headers: { "Authorization": `Bearer ${user.token}` }
    });
};

const getPharmacistOverview = () => {
    const user = AuthService.getCurrentUser();
    return axios.get(API_URL + "pharmacist/overview", {
        headers: { "Authorization": `Bearer ${user.token}` }
    });
};

const getPatientHistory = () => {
    const user = AuthService.getCurrentUser();
    return axios.get(API_URL + `patient/${user.id}/history`, {
        headers: { "Authorization": `Bearer ${user.token}` }
    });
};

const AnalyticsService = {
    getAdminStats,
    getPharmacistOverview,
    getPatientHistory
};

export default AnalyticsService;
