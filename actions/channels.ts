import axiosInstance from "@/lib/axios";

export interface Channel {
  id: string;
  name: string;
  creator_id: string;
  creator_first_name: string;
  creator_last_name: string;
  created_at: string;
  updated_at: string;
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
    console.log("Fetch channels response:", response.data);

    // Transform the response to include creator_name
    const channelsWithUserName: ChannelWithUserName[] = response.data.channels.map(
      (channel: Channel) => ({
        ...channel,
        creator_name: `${channel.creator_first_name} ${channel.creator_last_name}`,
      })
    );

    return {
      channels: channelsWithUserName,
      total: response.data.total,
    };
  } catch (error) {
    console.error("Error fetching channels:", error);
    throw error;
  }
};

export const createChannel = async (
  data: CreateChannelReq
): Promise<Channel> => {
  try {
    const response = await axiosInstance.post("/api/channels/", data);
    console.log("Create channel response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating channel:", error);
    throw error;
  }
};

export const deleteChannel = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/api/channels/${id}`);
  } catch (error) {
    console.error("Error deleting channel:", error);
    throw error;
  }
};
