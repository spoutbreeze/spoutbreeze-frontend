import { Event, CreateEventReq } from "@/actions/events";

export const convertEventToCreateEventReq = (event: Event, channelName?: string): CreateEventReq => {
  return {
    title: event.title,
    description: event.description,
    occurs: event.occurs,
    start_date: new Date(event.start_date),
    end_date: new Date(event.end_date),
    start_time: new Date(event.start_time),
    timezone: event.timezone,
    organizer_ids: event.organizers.map(org => org.id),
    channel_name: channelName || "",
  };
};