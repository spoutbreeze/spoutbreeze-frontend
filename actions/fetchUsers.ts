import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

// User interface
export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axiosInstance.get("/api/me");
    return response.data;
  } catch (error) {
    // Return null for any error (including 401)
    // Don't log 401 errors as they're expected when not authenticated
    if ((error as AxiosError)?.response?.status !== 401) {
      console.error("Error fetching user data:", error);
    }
    return null;
  }
};

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await axiosInstance.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
