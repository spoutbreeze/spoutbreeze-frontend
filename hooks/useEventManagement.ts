import { useState } from "react";
import {
  startEvent,
  deleteEvent,
  updateEvent,
  getJoinUrl,
  JoinUrls,
  CreateEventReq,
} from "@/actions/events";

interface UseEventManagementOptions {
  onDeleteSuccess?: () => void;
  onDeleteError?: (message: string) => void;
  onStartSuccess?: () => void;
  onStartError?: (message: string) => void;
  onUpdateSuccess?: () => void;
  onUpdateError?: (message: string) => void;
}

export const useEventManagement = (options?: UseEventManagementOptions) => {
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

  // Function to handle updating an event
  const handleUpdateEvent = async (
    eventId: string,
    data: Partial<CreateEventReq>
  ) => {
    try {
      const updatedEvent = await updateEvent(eventId, data);
      if (updatedEvent) {
        console.log("Event updated successfully:", updatedEvent);
        options?.onUpdateSuccess?.();
        return true;
      } else {
        const errorMessage = "Failed to update the event. Please try again.";
        setEventError(errorMessage);
        options?.onUpdateError?.(errorMessage);
        console.error("Error updating event:", errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = "Failed to update the event. Please try again.";
      setEventError(errorMessage);
      options?.onUpdateError?.(errorMessage);
      console.error("Error updating event:", error);
      return false;
    }
  };

  // Function to handle deleting an event
  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteEvent(eventId);
      console.log("Event deleted successfully");
      options?.onDeleteSuccess?.();
      return true;
    } catch (error) {
      const errorMessage = "Failed to delete the event. Please try again.";
      setEventError(errorMessage);
      options?.onDeleteError?.(errorMessage);
      console.error("Error deleting event:", error);
      return false;
    }
  };

  // Function to handle starting an event
  const handleStartEvent = async (eventId: string) => {
    try {
      const joinUrl = await startEvent(eventId);
      if (joinUrl) {
        console.log("Join URL:", joinUrl);
        window.open(joinUrl, "_blank");
        options?.onStartSuccess?.();
        return true;
      } else {
        const errorMessage =
          "Failed to start the event. Join URL not available.";
        setEventError(errorMessage);
        options?.onStartError?.(errorMessage);
        return false;
      }
    } catch (error) {
      const errorMessage = "Failed to start the event. Please try again.";
      setEventError(errorMessage);
      options?.onStartError?.(errorMessage);
      console.error("Error starting event:", error);
      return false;
    }
  };

  // Simplify the get join URL function since we don't need to call the API
  const handleGetJoinUrl = async (eventId: string): Promise<void> => {
    // No need to make API call anymore, just pass the eventId to the dialog
    // The dialog will generate shareable URLs using getShareableJoinUrl
    return Promise.resolve();
  };

  const open = Boolean(menuState.anchorEl);

  return {
    eventError,
    menuState,
    open,
    handleClick,
    handleClose,
    handleStartEvent,
    handleDeleteEvent,
    handleUpdateEvent,
    handleGetJoinUrl,
  };
};
