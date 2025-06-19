import axiosInstance from "@/lib/axios";

export interface UpdateProfileRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
}

export const updateUserProfile = async (updateData: UpdateProfileRequest) => {
  try {
    const response = await axiosInstance.put("/api/me/profile", updateData);
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};