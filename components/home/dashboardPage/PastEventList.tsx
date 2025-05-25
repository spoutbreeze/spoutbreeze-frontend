import React from "react";
import EventsTab from "./EventsTab";
import { fetchPastEvents } from "@/actions/events";

const PastEventList: React.FC = () => {
  return <EventsTab fetchFunction={fetchPastEvents} />;
};

export default PastEventList;
