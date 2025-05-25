import React from "react";
import EventList from "../events/EventList";
import { Events } from "@/actions/events";
import { eventMenuItems } from "../channelsPage/ChannelPage";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useSnackbar } from "@/hooks/useSnackbar";

interface EventsTabProps {
  fetchFunction: () => Promise<Events>;
  onRefresh?: (refreshFn: () => void) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ fetchFunction, onRefresh }) => {
  const [eventsData, setEventsData] = React.useState<Events>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { showSnackbar } = useSnackbar();

  const { menuState, handleClick, handleClose, handleStartEvent } =
    useEventManagement();

  const fetchEventsData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFunction();

      if (data.events.length === 0 && data.total === 0) {
        setError("No events found.");
        setEventsData({ events: [], total: 0 });
      } else {
        setEventsData({ events: data.events, total: data.total });
        setError(null);
      }
    } catch (error) {
      if (error instanceof Error && error.message === "SERVER_ERROR") {
        setError(
          "The server encountered an error while retrieving events. Please try again later."
        );
        showSnackbar("Server error while retrieving events", "error");
      } else if (
        error instanceof Error &&
        error.message === "VALIDATION_ERROR"
      ) {
        setError("There was an issue with the request format.");
        showSnackbar("Request validation error", "error");
      } else {
        setError("Failed to fetch events. Please try again.");
        showSnackbar("Failed to fetch events", "error");
      }
      setEventsData({ events: [], total: 0 });
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, showSnackbar]);

  React.useEffect(() => {
    fetchEventsData();
  }, []);

  // Expose refresh function to parent
  React.useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchEventsData);
    }
  }, [fetchEventsData, onRefresh]);

  return (
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
  );
};

export default EventsTab;
