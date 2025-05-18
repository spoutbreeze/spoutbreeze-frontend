"use client";

import React, { useState } from "react";
import { createEvent, CreateEventReq } from "@/actions/events";
import { ChannelWithUserName } from "@/actions/channels";
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

// Configure dayjs to use UTC and timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

// Get all available timezones
const timezones = Intl.supportedValuesOf("timeZone").sort();

interface EventFormProps {
  channel: ChannelWithUserName;
  onBack: () => void;
}

const CreateEvent: React.FC<EventFormProps> = ({ channel, onBack }) => {
  // Detect user's timezone
  const detectedTimezone = dayjs.tz.guess();

  const [selectedTimezone, setSelectedTimezone] = useState(detectedTimezone);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<CreateEventReq>({
    title: "",
    description: "",
    occurs: "once",
    start_date: new Date(),
    end_date: new Date(),
    start_time: new Date(),
    timezone: detectedTimezone,
    organizer_ids: [],
    channel_name: channel.name,
  });

  // Fetch current user data
  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);

      if (userData && userData.first_name) {
        setFormData((prev) => ({
          ...prev,
          organizer_ids: [userData.id],
        }));
      }
    };

    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert times to UTC using dayjs with the selected timezone
      const startTimeUTC = dayjs(formData.start_time)
        .tz(selectedTimezone)
        .utc()
        .toDate();

      const eventData: CreateEventReq = {
        ...formData,
        start_time: startTimeUTC, // Use UTC time for API
      };

      await createEvent(eventData);
      setSuccess(true);
      setTimeout(() => {
        onBack();
      }, 2000);
    } catch (err) {
      setError("Failed to create event. Please try again.");
      console.error(err);
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
      <div className="flex items-center mb-6">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="text"
          color="inherit"
        >
          Back
        </Button>
      </div>

      <h1 className="text-[22px] text-[#262262] font-semibold mb-6">
        Create New Event for {channel.name}
      </h1>

      {success ? (
        <div className="bg-green-100 p-4 rounded mb-6">
          Event created successfully! Redirecting...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 p-4 rounded mb-4 text-red-700">
              {error}
            </div>
          )}

          <TextField
            label="Event Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            fullWidth
            variant="outlined"
            sx={{ mb: "20px" }}
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
              onChange={handleChange}
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
                  if (date)
                    setFormData((prev) => ({ ...prev, end_date: date }));
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
            organizer_ids={formData.organizer_ids} // Array of user IDs
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
              {loading ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEvent;
