import axios from "axios";
import { FeedbackData } from "../types";

console.log(import.meta.env.BASE_URL);
class ApiService {

    // instantiate axios client
    private axiosClient = axios.create({
        baseURL: import.meta.env.VITE_API_URL,
    });

    async submitFeedback(feedback: FeedbackData) {
        const response = await this.axiosClient.post("/feedback", feedback);
        return response.data;
    }

    async getFeedback() {
        const response = await this.axiosClient.get("/feedback");
        return response.data;
    }
}

export default new ApiService();