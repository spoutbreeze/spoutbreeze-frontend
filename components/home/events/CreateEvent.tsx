"use client";

import React, { useState } from "react";
import { createEvent, CreateEventReq, Event } from "@/actions/events";
import { ChannelWithUserName, fetchChannels } from "@/actions/channels";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { User, fetchCurrentUser } from "@/actions/fetchUsers";
import OrganizerSelector from "./OrganizerSelector";
import NavigateBeforeRoundedIcon from "@mui/icons-material/NavigateBeforeRounded";

// Configure dayjs to use UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Get all available timezones
const timezones = Intl.supportedValuesOf("timeZone").sort();

interface EventFormProps {
  channel?: ChannelWithUserName;
  onBack: () => void;
  onEventCreated?: () => void;
  onError?: (message: string) => void;
  eventToEdit?: CreateEventReq;
  onEventUpdated?: (eventId: string, data: Partial<CreateEventReq>) => void;
}

const CreateEvent: React.FC<EventFormProps> = ({
  channel,
  onBack,
  onEventCreated,
  onError,
  eventToEdit,
  onEventUpdated,
}) => {
  // Detect user's timezone
  const detectedTimezone = dayjs.tz.guess();

  // Add state for available channels
  const [availableChannels, setAvailableChannels] = useState<
    ChannelWithUserName[]
  >([]);

  const [selectedTimezone, setSelectedTimezone] = useState(detectedTimezone);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [titleError, setTitleError] = useState<string | null>(null); // State for title error

  // Initialize formData based on whether channel is provided
  const [formData, setFormData] = useState<CreateEventReq>({
    title: eventToEdit ? eventToEdit.title : "",
    description: eventToEdit ? eventToEdit.description : "",
    occurs: eventToEdit ? eventToEdit.occurs : "once",
    start_date: eventToEdit ? eventToEdit.start_date : new Date(),
    end_date: eventToEdit ? eventToEdit.end_date : new Date(),
    start_time: eventToEdit ? eventToEdit.start_time : new Date(),
    timezone: eventToEdit ? eventToEdit.timezone : detectedTimezone,
    organizer_ids: eventToEdit ? eventToEdit.organizer_ids : [],
    channel_name: channel ? channel.name : "",
  });

  // Fetch current user data
  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);

        if (userData && userData.first_name) {
          setFormData((prev) => ({
            ...prev,
            organizer_ids: [userData.id],
          }));
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        if (onError) {
          onError("Failed to load user data");
        }
      }
    };

    fetchUser();
  }, [onError]);

  // Fetch available channels if no channel is provided
  React.useEffect(() => {
    if (!channel) {
      const loadChannels = async () => {
        try {
          const channelsResult = await fetchChannels();
          setAvailableChannels(channelsResult.channels);
        } catch (error) {
          console.error("Error fetching channels:", error);
          if (onError) {
            onError("Failed to load available channels");
          }
        }
      };

      loadChannels();
    }
  }, [channel, onError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear any previous title errors
    setTitleError(null);

    // Basic validation
    if (!formData.title.trim()) {
      if (onError) {
        onError("Event title is required.");
      }
      return;
    }

    if (formData.title.length < 3) {
      if (onError) {
        onError("Event title must be at least 3 characters long.");
      }
      return;
    }

    // Validate channel name
    if (!formData.channel_name.trim()) {
      if (onError) {
        onError("Channel name is required.");
      }
      return;
    }

    if (formData.channel_name.length < 2) {
      if (onError) {
        onError("Channel name must be at least 2 characters long.");
      }
      return;
    }

    setLoading(true);

    try {
      // Convert times to UTC using dayjs with the selected timezone
      const startTimeUTC = dayjs(formData.start_time)
        .tz(selectedTimezone)
        .utc()
        .toDate();

      const eventData: CreateEventReq = {
        ...formData,
        start_time: startTimeUTC,
      };

      if (eventToEdit && onEventUpdated) {
        // If editing an existing event, call the update function
        await onEventUpdated(eventToEdit.title, eventData);
      } else {
        // If creating a new event, call the create function
        await createEvent(eventData);
      }
      // Call the callback to refresh events list
      if (onEventCreated) {
        onEventCreated();
      }

      // Navigate back immediately
      onBack();
    } catch (err) {
      console.error("Error creating event:", err);
      if (err instanceof Error) {
        if (err.message === "DUPLICATE_TITLE") {
          setTitleError("This title is already taken");
          if (onError) {
            onError(
              "An event with this title already exists. Please choose a different title."
            );
          }
        } else if (err.message === "VALIDATION_ERROR") {
          if (onError) {
            onError("Please check your input data and try again.");
          }
        } else if (err.message === "SERVER_ERROR") {
          if (onError) {
            onError("Server error occurred. Please try again later.");
          }
        } else {
          if (onError) {
            onError("Failed to create event. Please try again.");
          }
        }
      } else {
        if (onError) {
          onError("An unexpected error occurred.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="w-[50%]">
      <h1 className="text-[18px] font-medium mb-6 -ml-1.5">
        <NavigateBeforeRoundedIcon
          onClick={onBack}
          sx={{
            width: "25px",
            height: "25px",
            cursor: "pointer",
          }}
        />
        {eventToEdit
          ? `Edit Event: ${eventToEdit.title}`
          : channel
          ? `Create New Event for ${channel.name}`
          : "Create New Event"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <TextField
          label="Event Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          fullWidth
          variant="outlined"
          sx={{ mb: "20px" }}
          error={!!titleError} // Show error state if titleError is not null
          helperText={titleError} // Display the error message
        />

        <TextField
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: "20px" }}
        />

        <FormControl fullWidth>
          <InputLabel>Occurrence</InputLabel>
          <Select
            name="occurs"
            value={formData.occurs}
            label="Occurrence"
            onChange={(e) => {
              const { value } = e.target;
              setFormData((prev) => ({ ...prev, occurs: value }));
            }}
            sx={{ mb: "20px" }}
          >
            <MenuItem value="once">Once</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Start Date"
              value={formData.start_date}
              onChange={(date) => {
                if (date)
                  setFormData((prev) => ({ ...prev, start_date: date }));
              }}
            />
          </LocalizationProvider>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="End Date"
              value={formData.end_date}
              onChange={(date) => {
                if (date) setFormData((prev) => ({ ...prev, end_date: date }));
              }}
              minDate={formData.start_date}
            />
          </LocalizationProvider>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              label="Start Time"
              value={formData.start_time}
              onChange={(time) => {
                if (time)
                  setFormData((prev) => ({ ...prev, start_time: time }));
              }}
            />
          </LocalizationProvider>

          <Autocomplete
            options={timezones}
            value={selectedTimezone}
            onChange={(_, newValue) => {
              if (newValue) setSelectedTimezone(newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Timezone"
                helperText="Select your timezone"
                fullWidth
              />
            )}
          />
        </div>

        {/* organizers */}
        <OrganizerSelector
          organizer_ids={formData.organizer_ids}
          currentUser={user}
          onAddOrganizer={(newOrganizerId) => {
            setFormData((prev) => ({
              ...prev,
              organizer_ids: [...prev.organizer_ids, newOrganizerId],
            }));
          }}
          onRemoveOrganizer={(organizerId) => {
            const newOrganizers = formData.organizer_ids.filter(
              (id) => id !== organizerId
            );
            setFormData((prev) => ({
              ...prev,
              organizer_ids: newOrganizers,
            }));
          }}
        />

        {/* Replace the existing channel selection with Autocomplete for better UX */}
        {channel ? (
          <TextField
            label="Channel Name"
            name="channel_name"
            value={formData.channel_name}
            required
            fullWidth
            variant="outlined"
            disabled
            sx={{ mb: "20px" }}
          />
        ) : (
          <Autocomplete
            fullWidth
            freeSolo
            options={availableChannels.map((channel) => channel.name)}
            value={formData.channel_name}
            onChange={(event, newValue) => {
              setFormData((prev) => ({
                ...prev,
                channel_name: newValue || "",
              }));
            }}
            onInputChange={(event, newInputValue) => {
              setFormData((prev) => ({
                ...prev,
                channel_name: newInputValue,
              }));
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Channel"
                name="channel_name"
                required
                variant="outlined"
                helperText="Select an existing channel or type a new channel name"
                sx={{ mb: "20px" }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...otherProps } = props;
              return (
                <li key={key} {...otherProps}>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">📁</span>
                    {option}
                  </div>
                </li>
              );
            }}
            noOptionsText="Type to create a new channel"
            sx={{ mb: "20px" }}
          />
        )}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="contained"
            onClick={onBack}
            sx={{
              padding: "10px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              backgroundColor: "#CCCCCC",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#CCCCCC",
                boxShadow: "none",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="outlined"
            sx={{
              padding: "10px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "none",
              color: "#27AAFF",
              borderColor: "#27AAFF",
            }}
            disabled={loading}
          >
            {loading
              ? eventToEdit
                ? "Updating..."
                : "Creating..."
              : eventToEdit
              ? "Update Event"
              : "Create Event"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;
