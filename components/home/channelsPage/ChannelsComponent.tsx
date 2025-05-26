"use client";

import React, { useState, useEffect } from "react";
import {
  fetchChannels,
  createChannel,
  deleteChannel,
  Channels,
  Channel,
  CreateChannelReq,
  ChannelWithUserName,
} from "@/actions/channels";
import { fetchUserById } from "@/actions/fetchUsers";

import Image from "next/image";
import ChannelPage from "./ChannelPage";
import AddChannelModal from "./AddChannelModal";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import { useGlobalSnackbar } from '@/contexts/SnackbarContext';

const colorPalette = [
  "#27AAFF", // Light Blue
  "#FF092A", // Red
  "#44D500", // Green
  "#9747FF", // Purple
  "#2E27FF", // Indigo
  "#FF0099", // Pink
  "#FF8800", // Deep Orange
  "#FFC919", // Yellow
];

// Function to get a random color based on the channel ID
const getRandomColor = (id: string) => {
  // Use a more distributed hash algorithm
  const hash = id.split("").reduce((acc, char, index) => {
    // Prime multiplication helps distribute values better
    return acc + char.charCodeAt(0) * (31 ** index % 127);
  }, 0);

  // Use a larger prime number for modulo to improve distribution
  return colorPalette[Math.abs(hash) % colorPalette.length];
};

const ChannelsComponent: React.FC = () => {
  const [channelsData, setChannelsData] = useState<Channels>({
    channels: [],
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] =
    useState<ChannelWithUserName | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<string | null>(null);

  // Replace the useSnackbar hook:
  const { showSnackbar } = useGlobalSnackbar();

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

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
        showSnackbar("Failed to fetch channels", "error");
      }
    };
    fetchChannelsData();
  }, []);

  const handleAddChannel = async (formData: CreateChannelReq) => {
    try {
      await createChannel(formData);

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
      handleCloseModal();
      showSnackbar("Channel created successfully", "success");
    } catch (error) {
      showSnackbar("Failed to create channel", "error");
    }
  };

  const confirmDeleteChannel = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChannelToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteChannel = async () => {
    if (!channelToDelete) return;

    try {
      await deleteChannel(channelToDelete);
      setChannelsData((prev) => ({
        ...prev,
        channels: prev.channels.filter((channel) => channel.id !== channelToDelete),
      }));
      showSnackbar("Channel deleted successfully", "success");
    } catch (error) {
      showSnackbar("Failed to delete channel", "error");
    } finally {
      closeDeleteDialog();
      setChannelToDelete(null);
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setChannelToDelete(null);
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
        channelId={selectedChannel.id}
      />
    );
  }

  return (
    <section className="px-10 pt-10 h-screen overflow-y-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-[18px] font-medium text-black mb-[20px]">
          Channels
        </h1>
        <button
          className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer"
          onClick={handleOpenModal}
        >
          + Create a channel
        </button>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {channelsData.channels.map((channel) => (
            <div
              key={channel.id}
              className="h-[110px] rounded-[10px] relative cursor-pointer"
              style={{ backgroundColor: getRandomColor(channel.id) }}
              onClick={() => handleChannelClick(channel)}
            >
              <div className="flex flex-col h-full text-white p-[15px]">
                <span className="text-lg font-semibold mb-auto">
                  {channel.name}
                </span>
                <div className="flex justify-between items-center">
                  <span className="text-[12px] font-medium">
                    Created by {channel.creator_name}
                  </span>
                  <Image
                    src="/delete_icon_outlined_white.svg"
                    alt="Delete Channel"
                    width={15}
                    height={16}
                    className="cursor-pointer"
                    onClick={(e) => confirmDeleteChannel(channel.id, e)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* The confirmation dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Channel"
        message="Are you sure you want to delete this channel? This action cannot be undone."
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteChannel}
      />
      <AddChannelModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddChannel}
      />
    </section>
  );
};

export default ChannelsComponent;
