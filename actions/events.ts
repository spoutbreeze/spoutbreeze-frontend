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
  meeting_id: string | null;
  moderator_pw: string | null;
  attendee_pw: string | null;
  meeting_created: boolean;
  timezone: string;
  created_at: string;
  updated_at: string;
  status: "scheduled" | "live" | "ended" | "cancelled"; // Add status field
  actual_start_time: string | null; // Add actual_start_time
  actual_end_time: string | null; // Add actual_end_time
}

export interface Events {
  events: Event[];
  total: number;
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
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        return { events: [], total: 0 };
      }
      
      if (status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
};

export const fetchEventsByChannelId = async (channelId: string): Promise<Events> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { events: [], total: 0 };
    }

    const response = await axiosInstance.get(`/api/events/channel/${channelId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        return { events: [], total: 0 };
      }
      
      if (status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
};

export const fetchUpcmingEvents = async (): Promise<Events> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { events: [], total: 0 };
    }

    const response = await axiosInstance.get("/api/events/upcoming");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        return { events: [], total: 0 };
      }
      
      if (status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
};

export const fetchPastEvents = async (): Promise<Events> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return { events: [], total: 0 };
    }

    const response = await axiosInstance.get("/api/events/past");
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      
      if (status === 404) {
        return { events: [], total: 0 };
      }
      
      if (status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
};

export const createEvent = async (data: CreateEventReq): Promise<Event | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }
    
    const response = await axiosInstance.post("/api/events/", data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
      console.error("API Error Status:", error.response?.status);
      
      // Handle specific backend errors
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.detail || "";
        
        // Check for duplicate title error
        if (errorMessage.includes("already exists")) {
          throw new Error("DUPLICATE_TITLE");
        }
        
        throw new Error("VALIDATION_ERROR");
      }
      
      if (error.response?.status === 422) {
        throw new Error("VALIDATION_ERROR");
      }
      
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.detail || "";
        
        if (errorMessage.includes("duplicate key value violates unique constraint") && 
            errorMessage.includes("events_title_key")) {
          throw new Error("DUPLICATE_TITLE");
        }
        
        throw new Error("SERVER_ERROR");
      }
    }
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

export const updateEvent = async (eventId: string, data: Partial<CreateEventReq>): Promise<Event | null> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axiosInstance.put(`/api/events/${eventId}`, data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
      console.error("API Error Status:", error.response?.status);
      
      // Handle specific backend errors
      if (error.response?.status === 400) {
        throw new Error("VALIDATION_ERROR");
      }
      
      if (error.response?.status === 404) {
        throw new Error("EVENT_NOT_FOUND");
      }
      
      if (error.response?.status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    await axiosInstance.delete(`/api/events/${eventId}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("API Error Response:", error.response?.data);
      console.error("API Error Status:", error.response?.status);
      
      if (error.response?.status === 404) {
        throw new Error("EVENT_NOT_FOUND");
      }
      
      if (error.response?.status === 500) {
        throw new Error("SERVER_ERROR");
      }
    }
    throw error;
  }
}