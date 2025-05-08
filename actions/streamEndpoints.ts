import axiosInstance from "@/lib/axios";

export interface StreamEndpoints {
  id: string;
  title: string;
  rtmp_url: string;
  stream_key: string;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface createStreamEndpointReq {
  title: string;
  rtmp_url: string;
  stream_key: string;
}

export const fetchStreamEndpoints = async (): Promise<StreamEndpoints[]> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    const response = await axiosInstance.get("/api/stream-endpoint/");
    return response.data;
  } catch (error) {
    console.error("Error fetching stream endpoints:", error);
    throw error;
  }
};

export const createStreamEndpoint = async (
  data: createStreamEndpointReq
): Promise<createStreamEndpointReq[]> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    const response = await axiosInstance.post(
      "/api/stream-endpoint/create",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating stream endpoint:", error);
    throw error;
  }
};

export const deleteStreamEndpoint = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    await axiosInstance.delete(`/api/stream-endpoint/${id}`);
  } catch (error) {
    console.error("Error deleting stream endpoint:", error);
    throw error;
  }
};

export const updateStreamEndpoint = async (
  id: string,
  data: createStreamEndpointReq
): Promise<createStreamEndpointReq[]> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return [];
    }

    const response = await axiosInstance.put(
      `/api/stream-endpoint/${id}`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating stream endpoint:", error);
    throw error;
  }
}

