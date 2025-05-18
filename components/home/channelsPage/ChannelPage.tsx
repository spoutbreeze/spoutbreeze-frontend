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
import CreateEvent from "@/components/events/CreateEvent";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

interface ChannelPageProps {
  channel: ChannelWithUserName;
  onBack: () => void;
  channelId: string;
}

const eventMenuItems = [
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
  const [organizers, setOrganizers] = React.useState<Organizers[]>([]);
  const [loadingOrganizers, setLoadingOrganizers] = React.useState(true);
  const [errorOrganizers, setErrorOrganizers] = React.useState<string | null>(
    null
  );
  const [showEventForm, setShowEventForm] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
  }, [channelId, showEventForm]);

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const handleBackToChannel = () => {
    setShowEventForm(false);
  };

  if (showEventForm) {
    return (
      <section className="px-10 pt-8 h-screen overflow-y-auto">
        <CreateEvent channel={channel} onBack={handleBackToChannel} />
      </section>
    );
  }

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
      <div className="flex flex-col mt-10 h-[30vh] overflow-y-auto">
        <h1 className="text-[22px] text-[#262262] font-semibold mb-4 sticky top-0 bg-white pb-2 z-10">
          Upcoming events
        </h1>
        {loading ? (
          <p className="text-center py-4">Loading events...</p>
        ) : error ? (
          <p className="text-center py-4 text-red-500">{error}</p>
        ) : (
          <div className="overflow-y-auto">
            {eventsData.events.map((event, index) => (
              <List key={event.id} disablePadding>
                <ListItem
                  disablePadding
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    
                  }}
                >
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

                  {/* item related buttons */}
                  <div className="flex items-center">
                    <button className="flex items-center text-[#27AAFF] font-medium text-[13px] cursor-pointer mr-[15px] whitespace-nowrap">
                      <Image
                        src="/events/link_icon.svg"
                        alt="copy link"
                        width={15}
                        height={15}
                        className="mr-[5px]"
                      />
                      Copy Link
                    </button>
                    {/* more options button with icon */}
                    <button
                      id="event-menu"
                      aria-controls={open ? "event-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={open ? "true" : undefined}
                      onClick={handleClick}
                      className="flex text-[#27AAFF] font-medium text-[13px] cursor-pointer"
                    >
                      <MoreVertIcon className="mr-[5px]" />
                    </button>
                    <Menu
                      id="event-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      slotProps={{
                        list: {
                          "aria-labelledby": "basic-button",
                          sx: {
                            padding: 0,
                            margin: 0,
                          },
                        },
                        paper: {
                          sx: {
                            borderRadius: "10px",
                            minWidth: "120px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                            padding: 0,
                          },
                        },
                      }}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                      {eventMenuItems.map((item) => (
                        <MenuItem
                          key={item.key}
                          onClick={handleClose}
                          sx={{
                            padding: "15px 15px",
                            "&:hover": {
                              backgroundColor: "#2686BE1A",
                            },
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={14}
                              height={14}
                              className="mr-2"
                            />
                            <span>{item.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Menu>
                  </div>
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
