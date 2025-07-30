import axios from "axios"
import { handleApiError } from "./handleApiError";
import { toast } from "sonner";
import { getSession } from "next-auth/react";

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_STRAPI_URL,
});

axiosInstance.interceptors.request.use(async (config) => {
    const session = await getSession();
    if(session?.jwt){
        config.headers.Authorization = `Bearer ${session.jwt}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const errorMessage = handleApiError(error);
        toast.error(errorMessage);
        return Promise.reject(error);
    }
);

export default axiosInstance;