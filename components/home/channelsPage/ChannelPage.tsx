"use client";

import React from "react";
import { ChannelWithUserName } from "@/actions/channels";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface ChannelPageProps {
  channel: ChannelWithUserName;
  onBack: () => void;
}

const ChannelPage: React.FC<ChannelPageProps> = ({ channel, onBack }) => {
  return (
    <section className="px-10 pt-8 h-screen overflow-y-auto">
      {/* Header with back button */}
      <div className="flex items-center">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={onBack}
          variant="text"
          color="inherit"
        >
          Back to Channels
        </Button>
      </div>

      {/* Channel header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="font-medium text-[18px]">{channel.name}</span>
          <span className="font-medium text-[13px] text-[#5B5D60]">333 Sessions | 22 Recordings</span>
        </div>
        <div>
          <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer mr-4">
            Create Event
          </button>
          <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer">
            Start Session
          </button>
        </div>
      </div>
    </section>
  );
};

export default ChannelPage;
