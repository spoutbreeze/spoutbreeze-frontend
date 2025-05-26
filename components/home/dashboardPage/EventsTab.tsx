import React from "react";
import EventList from "../events/EventList";
import { Events } from "@/actions/events";
import { eventMenuItems } from "../channelsPage/ChannelPage";
import { useEventManagement } from "@/hooks/useEventManagement";
import { useGlobalSnackbar } from '@/contexts/SnackbarContext';

interface EventsTabProps {
  fetchFunction: () => Promise<Events>;
  onRefresh?: (refreshFn: () => void) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ 
  fetchFunction, 
  onRefresh,
}) => {
  const { showSnackbar } = useGlobalSnackbar();
  const [eventsData, setEventsData] = React.useState<Events>({
    events: [],
    total: 0,
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const { menuState, handleClick, handleClose, handleStartEvent, handleDeleteEvent } =
    useEventManagement({
      onDeleteSuccess: () => {
        showSnackbar("Event deleted successfully!", "success");
        fetchEventsData(); // Refresh the events list
      },
      onDeleteError: (message: string) => {
        showSnackbar(message, "error");
      },
      onStartSuccess: () => {
        showSnackbar("Event started successfully!", "success");
      },
      onStartError: (message: string) => {
        showSnackbar(message, "error");
      },
    });

  const fetchEventsData = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await fetchFunction();

      if (data.events.length === 0 && data.total === 0) {
        setEventsData({ events: [], total: 0 });
        setError(null);
      } else {
        setEventsData(data);
        setError(null);
      }
    } catch (error) {
      setError("Failed to load events. Please try again later.");
      showSnackbar("Failed to load events", "error");
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
      handleDeleteEvent={handleDeleteEvent}
    />
  );
};

export default EventsTab;
