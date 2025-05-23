import React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Button from "@mui/material/Button";
import EventList from "../events/EventList";
import PastEventList from "./PastEventList";
import { Events, fetchEvents } from "@/actions/events";
import { eventMenuItems } from "../channelsPage/ChannelPage";
import { useEventManagement } from "@/hooks/useEventManagement";
import CreateEvent from "@/components/home/events/CreateEvent";
import CustomSnackbar from "@/components/common/CustomSnackbar";
import { useSnackbar } from "@/hooks/useSnackbar";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: "20px" }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Dashboard: React.FC = () => {
  const [value, setValue] = React.useState(0);
  const [eventsData, setEventsData] = React.useState<Events>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showEventForm, setShowEventForm] = React.useState(false);

  // Add snackbar hook for success messages
  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  // Use the custom hook instead of duplicating state and functions
  const {
    eventError,
    menuState,
    open,
    handleClick,
    handleClose,
    handleStartEvent,
  } = useEventManagement();

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      const data = await fetchEvents();
      setEventsData(data);
      setError(null);
    } catch (error) {
      setError("Failed to fetch events. Please try again.");
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEventsData();
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const handleCreateEvent = () => {
    setShowEventForm(true);
  };

  const handleBackToChannel = () => {
    setShowEventForm(false);
  };

  // Handle successful event creation
  const handleEventCreated = async () => {
    // Refresh the events list
    await fetchEventsData();
    // Show success message
    showSnackbar("Event created successfully!", "success");
  };

  // Handle event creation errors
  const handleEventError = (message: string) => {
    showSnackbar(message, "error");
  };

  // Fix the issue with showing the CreateEvent form from Dashboard
  if (showEventForm) {
    return (
      <section className="px-10 pt-10 h-screen overflow-y-auto">
        <CreateEvent
          onBack={handleBackToChannel}
          onEventCreated={handleEventCreated}
          onError={handleEventError}
        />
      </section>
    );
  }

  return (
    <section className="px-10 py-10 h-screen flex flex-col">
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[18px] font-medium">Dashboard</h1>
      </div>

      <div className="flex justify-between items-center">
        <Box
          sx={{
            width: "fit-content",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            textColor="primary"
            indicatorColor="primary"
            sx={{
              "& .MuiTab-root": {
                color: "#CCCCCC", // Default tab color
                "&.Mui-selected": {
                  color: "#27AAFF", // Selected tab color
                },
                // Add padding to control tab width
                paddingLeft: 0,
                paddingRight: "30px",
                paddingTop: 0,
                paddingBottom: 0,
                minWidth: "unset",
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#27AAFF", // Indicator color
                height: 3, // Make the indicator slightly thicker
              },
            }}
          >
            <Tab
              label="Upcoming events"
              {...a11yProps(0)}
              sx={{ fontSize: "14px", fontWeight: 500 }}
            />
            <Tab
              label="Past events"
              {...a11yProps(1)}
              sx={{ fontSize: "14px", fontWeight: 500 }}
            />
          </Tabs>
        </Box>

        <Button
          variant="outlined"
          onClick={handleCreateEvent}
          sx={{
            color: "#27AAFF",
            padding: "10px",
            fontSize: "12px",
            fontWeight: 500,
            borderRadius: "5px",
            borderColor: "#27AAFF",
          }}
        >
          Schedule
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <CustomTabPanel value={value} index={0}>
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
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <PastEventList />
        </CustomTabPanel>
      </div>

      {/* Add snackbar for success messages */}
      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </section>
  );
};

export default Dashboard;
