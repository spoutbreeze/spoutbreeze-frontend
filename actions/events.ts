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
  moderator_pw: string;
  attendee_pw: string;
  created_at: string;
  updated_at: string;
}

export interface Events {
  events: Event[];
  total: number;
  statusCode?: number;
}

export interface CreateEventReq {
  title: string;
  description: string;
  occurs: string;
  start_date: Date;
  end_date: Date;
  start_time: Date;
  timezone: string;
  organizer_ids: string[];
  channel_name: string;
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
          throw new Error(
            `API Error: ${error.response.status} - ${error.response.statusText}`
          );
        }
      }
      throw error; // Re-throw for other errors
    }
  } catch (error) {
    console.error("Error fetching events by channel ID:", error);
    throw error;
  }
};

export const createEvent = async (data: CreateEventReq): Promise<Event> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return {} as Event;
    }
    const response = await axiosInstance.post("/api/events/", data);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

// Fucntion to start an event, it will return the join url
export const startEvent = async (eventId: string): Promise<string | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null;
    }

    const response = await axiosInstance.post(`/api/events/${eventId}/start`);
    return response.data.join_url;
  } catch (error) {
    console.error("Error starting event:", error);
    return null;
  }
};
