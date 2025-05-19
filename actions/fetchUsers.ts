import axiosInstance from "@/lib/axios";

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
};

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
};

export const fetchUsers = async (): Promise<User[]> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    const response = await axiosInstance.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};
