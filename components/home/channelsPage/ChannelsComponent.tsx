"use client";

import React, { useState, useEffect } from "react";
import {
  fetchChannels,
  deleteChannel,
  Channels,
  Channel,
  CreateChannelReq,
  ChannelWithUserName,
} from "@/actions/channels";
import { fetchUserById } from "@/actions/fetchUsers";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import ChannelPage from "./ChannelPage";

const colorPalette = [
  "#FF9024", // Orange
  "#27AAFF", // Blue
  "#9C27B0", // Purple
  "#4CAF50", // Green
  "#F44336", // Red
  "#009688", // Teal
  "#673AB7", // Deep Purple
  "#3F51B5", // Indigo
  "#2196F3", // Light Blue
  "#00BCD4", // Cyan
  "#795548", // Brown
  "#FF5722", // Deep Orange
  "#607D8B", // Blue Grey
  "#E91E63", // Pink
];

// Function to get a random color based on the channel ID
const getRandomColor = (id: string) => {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colorPalette[hash % colorPalette.length];
};

const ChannelsComponent: React.FC = () => {
  const [channelsData, setChannelsData] = useState<Channels>({
    channels: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<ChannelWithUserName | null>(null);

  useEffect(() => {
    const fetchChannelsData = async () => {
      try {
        const data = await fetchChannels();

        // Add user names to channels
        const channelsWithUserName = await Promise.all(
          data.channels.map(async (channel) => {
            const user = await fetchUserById(channel.creator_id || "");
            return {
              ...channel,
              creator_name: user
                ? `${user.first_name} ${user.last_name}`
                : "Unknown",
            };
          })
        );
        setChannelsData({ channels: channelsWithUserName, total: data.total });
        setLoading(false);
        setError(null);
      } catch (error) {
        setError("Failed to fetch channels");
        setLoading(false);
      }
    };
    fetchChannelsData();
  }, []);

  const handleDeleteChannel = async (id: string) => {
    try {
      await deleteChannel(id);
      setChannelsData((prev) => ({
        ...prev,
        channels: prev.channels.filter((channel) => channel.id !== id),
      }));
    } catch (error) {
      setError("Failed to delete channel");
    }
  };

  const handleChannelClick = (channel: ChannelWithUserName) => {
    setSelectedChannel(channel);
  };
  const handleBackToChannels = () => {
    setSelectedChannel(null);
  };

  if (selectedChannel) {
    return (
      <ChannelPage
        channel={selectedChannel}
        onBack={handleBackToChannels}
      />
    )
  }


  return (
    <section className="px-10 pt-10 h-screen overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-medium text-black mb-[20px]">
          Channels
        </h1>
        <button className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer">
          + Add endpoint
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(303px, 1fr))",
            gap: "20px",
          }}
        >
          {channelsData.channels.map((channel) => (
            <Card
              key={channel.id}
              sx={{
                backgroundColor: getRandomColor(channel.id),
                width: 303,
                height: 101,
                borderRadius: "10px",
                color: "white",
                position: "relative",
                cursor: "pointer",
              }}
              onClick={() => handleChannelClick(channel)}
            >
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  padding: "15px !important",
                }}
              >
                <span className="text-lg font-semibold mb-auto">
                  {channel.name}
                </span>
                <span className="flex justify-between">
                  <span className="text-[12px] font-medium">
                    Created by {channel.creator_name}
                  </span>
                  <Image
                    src="/delete_icon_outlined_white.svg"
                    alt="Channel Image"
                    width={15}
                    height={16}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChannel(channel.id);
                    }}
                  />
                </span>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </section>
  );
};

export default ChannelsComponent;
