import axiosInstance from '@/lib/axios';

// User interface
export interface User {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null;
    }

    const response = await axiosInstance.get("/api/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null;
    }

    const response = await axiosInstance.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}