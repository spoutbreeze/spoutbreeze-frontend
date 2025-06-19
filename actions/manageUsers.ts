import axiosInstance from "@/lib/axios";
import { User } from "./fetchUsers";

export interface UpdateUserRoleRequest {
  role: string;
}

export const updateUserRole = async (userId: string, role: string): Promise<User> => {
  try {
    const response = await axiosInstance.put(`/api/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};