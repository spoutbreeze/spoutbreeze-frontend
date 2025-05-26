import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Image from "next/image";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { formatTime, formatDate } from "@/utils/dateTimeFormatter";
import { Events } from "@/actions/events";

interface EventListProps {
  loading: boolean;
  error: string | null;
  eventsData: Events;
  eventMenuItems: Array<{ key: string; label: string; icon: string }>;
  handleClick: (event: React.MouseEvent<HTMLElement>, eventId: string) => void;
  handleClose: () => void;
  menuState: {
    anchorEl: HTMLElement | null;
    eventId: string | null;
  };
  handleStartEvent: (eventId: string) => void;
  handleDeleteEvent: (eventId: string) => void;
}

const EventList: React.FC<EventListProps> = ({
  loading,
  error,
  eventsData,
  eventMenuItems,
  handleClick,
  handleClose,
  menuState,
  handleStartEvent,
  handleDeleteEvent,
}) => {
  const open = Boolean(menuState.anchorEl);
  
  return (
    <div className="flex flex-col">
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
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "18px",
                        fontWeight: 500,
                      }
                    }
                  }}
                  secondary={
                    <React.Fragment>
                      <Box
                        component="span"
                        display="flex"
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
                    onClick={(e) => handleClick(e, event.id)}
                    className="flex text-[#27AAFF] font-medium text-[13px] cursor-pointer"
                  >
                    <MoreVertIcon className="mr-[5px]" />
                  </button>
                  <Menu
                    id={`event-menu-${event.id}`}
                    anchorEl={menuState.anchorEl}
                    open={open && menuState.eventId === event.id}
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
                        onClick={() => {
                          if (item.key === "start") {
                            if (menuState.eventId) {
                              handleStartEvent(menuState.eventId);
                            }
                          } else if (item.key === "delete") {
                            if (menuState.eventId) {
                              handleDeleteEvent(menuState.eventId);
                            }
                          }
                          handleClose();
                        }}
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
  );
};

export default EventList;