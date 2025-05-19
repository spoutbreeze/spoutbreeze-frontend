import { useState } from 'react';
import { startEvent } from '@/actions/events';

export const useEventManagement = () => {
  const [eventError, setEventError] = useState<string | null>(null);
  const [menuState, setMenuState] = useState<{
    anchorEl: HTMLElement | null;
    eventId: string | null;
  }>({
    anchorEl: null,
    eventId: null,
  });

  const handleClick = (
    event: React.MouseEvent<HTMLElement>,
    eventId: string
  ) => {
    setMenuState({
      anchorEl: event.currentTarget,
      eventId: eventId,
    });
  };

  const handleClose = () => {
    setMenuState({
      anchorEl: null,
      eventId: null,
    });
  };

  // Function to handle starting an event
  const handleStartEvent = async (eventId: string) => {
    try {
      const joinUrl = await startEvent(eventId);
      if (joinUrl) {
        console.log("Join URL:", joinUrl);
        window.open(joinUrl, "_blank");
        return true;
      } else {
        setEventError("Failed to start the event. Join URL not available.");
        return false;
      }
    } catch (error) {
      setEventError("Failed to start the event. Please try again.");
      console.error("Error starting event:", error);
      return false;
    }
  };

  const open = Boolean(menuState.anchorEl);

  return {
    eventError,
    menuState,
    open,
    handleClick,
    handleClose,
    handleStartEvent
  };
};