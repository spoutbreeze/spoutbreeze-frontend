import { clearTokens } from "@/lib/auth";
import axiosInstance from "@/lib/axios";
import axios from "axios";

export interface LogoutResponse {
  message: string;
  statusCode: number;
}

export const logout = async (): Promise<LogoutResponse> => {
  try {
    const token = localStorage.getItem("refresh_token");
    if (!token) {
      clearTokens();
      return { message: "No token found", statusCode: 401 };
    }

    const response = await axiosInstance.post("/api/logout", {
      refresh_token: token,
    });

    if (response.data.statusCode === 200) {
      clearTokens();
    }

    return response.data;
  } catch (error) {
    console.error("Error logging out:", error);
    clearTokens();
    return {
      message: "Logout failed",
      statusCode: 500,
    };
  }
};
