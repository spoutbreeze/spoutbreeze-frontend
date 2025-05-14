import axiosInstance from "@/lib/axios";
import axios from "axios";

export interface Organizers {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  occurs: string;
  start_date: string;
  end_date: string;
  start_time: string;
  creator_id: string;
  organizers: Organizers[];
  channel_id: string;
  meeting_id: string;
  created_at: string;
  updated_at: string;
}

export interface Events {
  events: Event[];
  total: number;
  statusCode?: number;
}

export const fetchEvents = async (): Promise<Events> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { events: [], total: 0 };
    }

    const response = await axiosInstance.get("/api/events/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const fetchEventsByChannelId = async (
  channelId: string
): Promise<Events> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { events: [], total: 0 };
    }

    try {
      const response = await axiosInstance.get(
        `/api/events/channel/${channelId}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific status codes
        if (error.response) {
          const status = error.response.status;
          
          if (status === 404) {
            // Return empty events with a specific error flag
            return { events: [], total: 0, statusCode: 404 };
          }
          
          if (status === 500) {
            // Return empty events with a specific error flag
            return { events: [], total: 0, statusCode: 500 };
          }
          
          // For other error statuses
          throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        }
      }
      throw error; // Re-throw for other errors
    }
  } catch (error) {
    console.error("Error fetching events by channel ID:", error);
    throw error;
  }
};