import axiosInstance from "@/lib/axios";

export interface Channel {
  id: string;
  name: string;
  creator_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ChannelWithUserName extends Channel {
  creator_name: string;
}

export interface Channels {
  channels: ChannelWithUserName[];
  total: number;
}

export interface CreateChannelReq {
  name: string;
}

export const fetchChannels = async (): Promise<Channels> => {
  try {


    const response = await axiosInstance.get("/api/channels/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
};

export const createChannel = async (
  data: CreateChannelReq
): Promise<Channel> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return {} as Channel;
    }
    const response = await axiosInstance.post("/api/channels/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

export const deleteChannel = async (id: string): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return;
    }

    await axiosInstance.delete(`/api/channels/${id}`);
  } catch (error) {
    console.error("Error deleting channel:", error);
    throw error;
  }
};
