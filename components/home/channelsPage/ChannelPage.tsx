"use client";

import React from "react";
import { ChannelWithUserName } from "@/actions/channels";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  fetchEventsByChannelId,
  Organizers,
  Events,
  Event,
} from "@/actions/events";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import { formatTime, formatDate } from "@/utils/dateTimeFormatter";

interface ChannelPageProps {
  channel: ChannelWithUserName;
  onBack: () => void;
  channelId: string;
}

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
  const [organizers, setOrganizers] = React.useState<Organizers[]>([]);
  const [loadingOrganizers, setLoadingOrganizers] = React.useState(true);
  const [errorOrganizers, setErrorOrganizers] = React.useState<string | null>(
    null
  );

  // Fetch events by channel ID
  React.useEffect(() => {
    const fetchEvents = async () => {
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
    };

    fetchEvents();
  }, [channelId]);

  return (
    <section className="px-10 pt-8 h-screen overflow-y-auto">
      {/* Header with back button */}
      <div className="flex items-center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="text"
          color="inherit"
        >
          Back to Channels
        </Button>
      </div>

      {/* Channel header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium text-[18px]">{channel.name}</span>
          <span className="font-medium text-[13px] text-[#5B5D60]">
            333 Sessions | 22 Recordings
          </span>
        </div>
        <div>
          <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer mr-4">
            Create Event
          </button>
          <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer">
            Start Session
          </button>
        </div>
      </div>

      {/* Event list */}
      <div className="flex flex-col mt-10 h-[30vh] overflow-y-auto">
        <h1 className="text-[22px] text-[#262262] font-semibold mb-4 sticky top-0 bg-white pb-2 z-10">
          Upcoming events
        </h1>
        {loading ? (
          <p className="text-center py-4">Loading events...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <div className="overflow-y-auto pb-2">
            {eventsData.events.map((event, index) => (
              <List key={event.id} disablePadding>
                <ListItem disablePadding>
                  <ListItemText
                    primary={event.title}
                    secondary={
                      <React.Fragment>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          mt={1}
                        >
                          <Image
                            src="/events/agenda_icon.svg"
                            alt="agenda"
                            width={15}
                            height={15}
                            className="mr-1"
                          />
                          <Typography
                            component="span"
                            variant="body2"
                            color="#5B5D60"
                          >
                            {formatDate(event.start_date)}
                          </Typography>

                          <Image
                            src="/events/clock_icon.svg"
                            alt="clock"
                            width={15}
                            height={15}
                            className="mx-2"
                          />
                          <Typography
                            component="span"
                            variant="body2"
                            color="#5B5D60"
                          >
                            {formatTime(event.start_time)}
                          </Typography>
                        </Box>
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < eventsData.events.length - 1 && (
                  <Divider sx={{ marginY: "12px" }} />
                )}
              </List>
            ))}
          </div>
        )}
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
