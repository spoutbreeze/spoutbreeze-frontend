"use client";

import React, { useCallback, useEffect } from "react";
import { ChannelWithUserName } from "@/actions/channels";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchEventsByChannelId,
  startEvent,
  Organizers,
  Events,
  Event,
} from "@/actions/events";
import CreateEvent from "@/components/home/events/CreateEvent";
import EventList from "../events/EventList";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";
import { useEventManagement } from "@/hooks/useEventManagement";

interface ChannelPageProps {
  channel: ChannelWithUserName;
  onBack: () => void;
  channelId: string;
}

export const eventMenuItems = [
  {
    key: "start",
    label: "Start",
    icon: "/events/play_icon.svg",
  },
  {
    key: "share",
    label: "Share",
    icon: "/events/share_icon.svg",
  },
  {
    key: "edit",
    label: "Edit",
    icon: "/events/edit_icon.svg",
  },
];

const ChannelPage: React.FC<ChannelPageProps> = ({
  channel,
  onBack,
  channelId,
}) => {
  const [eventsData, setEventsData] = React.useState<Events>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showEventForm, setShowEventForm] = React.useState(false);

  // Use the custom hook instead of duplicating state and functions
  const {
    eventError,
    menuState,
    open,
    handleClick,
    handleClose,
    handleStartEvent,
  } = useEventManagement();

  // Fetch events by channel ID
  const fetchEvents = useCallback(async () => {
    try {
      const data = await fetchEventsByChannelId(channelId);
      // Check for specific status codes
      if (data.statusCode === 404) {
        setError("This channel doesn't have any upcoming events.");
        setEventsData({ events: [], total: 0 });
      } else if (data.statusCode === 500) {
        setError(
          "The server encountered an error while retrieving events. Please try again later."
        );
        setEventsData({ events: [], total: 0 });
      } else {
        // Success case
        setEventsData({ events: data.events, total: data.total });
      }
    } catch (err) {
      // Generic error handling
      setError("Failed to load events. Please try again later.");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [channelId, showEventForm]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const handleBackToChannel = () => {
    fetchEvents();
    setShowEventForm(false);
  };

  if (showEventForm) {
    return (
      <section className="px-10 pt-10 h-screen overflow-y-auto">
        <CreateEvent channel={channel} onBack={handleBackToChannel} />
      </section>
    );
  }

  return (
    <section className="px-10 pt-10 h-screen overflow-y-auto">
      {/* Channel header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          {/* <div> */}
          <button className="flex items-center font-medium text-[18px] -ml-1.5 mb-[5px]">
            <NavigateBeforeRoundedIcon
              onClick={onBack}
              sx={{ cursor: "pointer" }}
            />
            {channel.name}
          </button>
          {/* </div> */}
          <span className="font-medium text-[13px] text-[#5B5D60]">
            333 Sessions | 22 Recordings{" "}
            {/*change this later to make it dynamic*/}
          </span>
        </div>
        <div>
          <button
            className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer mr-4"
            onClick={handleCreateEvent}
          >
            Create Event
          </button>
          <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer">
            Start Session
          </button>
        </div>
      </div>

      {/* Event list */}
      <div className="h-[30vh] mt-10 overflow-y-auto">
        <h1 className="text-[22px] text-[#262262] font-semibold mb-4 sticky top-0 bg-white pb-2 z-10">
          Upcoming events
        </h1>
        <EventList
          loading={loading}
          error={error}
          eventsData={eventsData}
          eventMenuItems={eventMenuItems}
          handleClick={handleClick}
          handleClose={handleClose}
          menuState={menuState}
          handleStartEvent={handleStartEvent}
        />
      </div>

      {/* Recordings section */}
      <div className="flex flex-col mt-6 h-[calc(50vh-80px)] overflow-y-auto">
        <h1 className="text-[22px] text-[#262262] font-semibold mb-4 sticky top-0 bg-white pb-2 z-10">
          Recordings
        </h1>
      </div>
    </section>
  );
};

export default ChannelPage;
