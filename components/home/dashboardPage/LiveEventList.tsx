import React from "react";
import EventsTab from "./EventsTab";
import { fetchLiveEvents } from "@/actions/events";

const LiveEventList: React.FC = () => {
  return <EventsTab fetchFunction={fetchLiveEvents} />;
};

export default LiveEventList;