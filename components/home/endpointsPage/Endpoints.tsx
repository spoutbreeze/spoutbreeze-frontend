"use client";

import React, { use, useEffect, useState } from "react";
import {
  fetchStreamEndpoints,
  StreamEndpoints,
  createStreamEndpoint,
  createStreamEndpointReq,
  deleteStreamEndpoint,
  updateStreamEndpoint,
} from "@/actions/streamEndpoints";
import { fetchUserById, User } from "@/actions/fetchUsers";
import Table from "@mui/joy/Table";
import { Box } from "@mui/material";
import Image from "next/image";
import AddEndpointModal from "./AddEndpointModal";
import DeleteConfirmationDialog from "@/components/common/DeleteConfirmationDialog";
import CustomSnackbar from "@/components/common/CustomSnackbar";
import { useSnackbar } from "@/hooks/useSnackbar";

export interface EndpointWithUserName extends StreamEndpoints {
  userName: string;
}

const Endpoints: React.FC = () => {
  const [streamEndpoints, setStreamEndpoints] = React.useState<
    EndpointWithUserName[]
  >([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEndpoint, setCurrentEndpoint] =
    useState<EndpointWithUserName | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [endpointToDelete, setEndpointToDelete] = useState<string | null>(null);

  const {
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    showSnackbar,
    closeSnackbar,
  } = useSnackbar();

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setIsEditing(false);
    setCurrentEndpoint(null);
  };

  const handleAddEndpoint = async (formData: createStreamEndpointReq) => {
    try {
      await createStreamEndpoint(formData);

      const data = await fetchStreamEndpoints();

      const endpointsWithUserName = await Promise.all(
        data.map(async (endpoint) => {
          const user = await fetchUserById(endpoint.user_id || "");
          return {
            ...endpoint,
            userName: user ? `${user.first_name} ${user.last_name}` : "Unknown",
          };
        })
      );

      setStreamEndpoints(endpointsWithUserName);
      handleCloseModal();
      showSnackbar("Endpoint created successfully", "success");
    } catch (error) {
      console.error("Error creating endpoint:", error);
      showSnackbar("Failed to create endpoint", "error");
    }
  };

  useEffect(() => {
    const fetchStreamEndpointsData = async () => {
      try {
        const data = await fetchStreamEndpoints();
        const endpointsWithUserName: EndpointWithUserName[] = await Promise.all(
          data.map(async (endpoint) => {
            const user = await fetchUserById(endpoint.user_id || "");
            return {
              ...endpoint,
              userName: user
                ? `${user.first_name} ${user.last_name}`
                : "Unknown",
            };
          })
        );
        setStreamEndpoints(endpointsWithUserName);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch stream endpoints");
        showSnackbar("Failed to fetch stream endpoints", "error");
        setLoading(false);
      }
    };
    fetchStreamEndpointsData();
  }, []);

  const confirmDeleteEndpoint = (id: string) => {
    setEndpointToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteEndpoint = async () => {
    if (!endpointToDelete) return;

    try {
      await deleteStreamEndpoint(endpointToDelete);
      setStreamEndpoints((prev) =>
        prev.filter((endpoint) => endpoint.id !== endpointToDelete)
      );
      showSnackbar("Endpoint deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting endpoint:", error);
      showSnackbar("Failed to delete endpoint", "error");
    } finally {
      closeDeleteDialog();
    }
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setEndpointToDelete(null);
  };

  const handleUpdateEndpoint = async (
    id: string,
    formData: createStreamEndpointReq
  ) => {
    try {
      await updateStreamEndpoint(id, formData);

      // Update the local state with user name preserved
      const updatedEndpoints = streamEndpoints.map((endpoint) =>
        endpoint.id === id
          ? { ...endpoint, ...formData, userName: endpoint.userName }
          : endpoint
      );
      setStreamEndpoints(updatedEndpoints);

      handleCloseModal();
      showSnackbar("Endpoint updated successfully", "success");
    } catch (error) {
      console.error("Error updating endpoint:", error);
      showSnackbar("Failed to update endpoint", "error");
    }
  };

  const handleEditEndpoint = (id: string) => {
    const endpointToEdit = streamEndpoints.find(
      (endpoint) => endpoint.id === id
    );
    if (endpointToEdit) {
      setCurrentEndpoint(endpointToEdit);
      setIsEditing(true);
      setOpenModal(true);
    }
  };

  return (
    <div className="px-10 pt-10 h-screen overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-medium text-black mb-[20px]">
          Endpoints
        </h1>
        <button
          className="mb-[14px] font-medium text-[13px] border p-2.5 text-[#27AAFF] rounded-[2px] cursor-pointer"
          onClick={handleOpenModal}
        >
          + Add endpoint
        </button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <Table
          sx={{
            "& tr:nth-of-type(odd)": {
              backgroundColor: "#F6F6F6",
            },
          }}
          borderAxis="none"
          className="rounded-[10px]"
        >
          <tbody className="text-[#5B5D60]">
            <tr>
              <td>ID</td>
              <td>TITLE</td>
              <td>CREATED BY</td>
              <td style={{ width: "7%" }} />
            </tr>
            {streamEndpoints.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center">
                  No stream endpoints available
                </td>
              </tr>
            )}
            {streamEndpoints.map((endpoint) => (
              <tr key={endpoint.id}>
                <td>{endpoint.id.substring(0, 5)}...</td>
                <td>{endpoint.title}</td>
                <td>{endpoint.userName}</td>
                <td>
                  <Box className="flex items-center justify-start">
                    <Image
                      src="/delete_icon_outlined.svg"
                      alt="Delete"
                      width={20}
                      height={20}
                      className="cursor-pointer mr-5"
                      onClick={() => confirmDeleteEndpoint(endpoint.id)}
                    />
                    <Image
                      src="/edit_icon_outlined.svg"
                      alt="Edit"
                      width={20}
                      height={20}
                      className="cursor-pointer"
                      onClick={() => handleEditEndpoint(endpoint.id)}
                    />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Endpoint"
        message="Are you sure you want to delete this endpoint? This action cannot be undone."
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteEndpoint}
      />

      <AddEndpointModal
        open={openModal}
        onClose={handleCloseModal}
        onAdd={handleAddEndpoint}
        onUpdate={handleUpdateEndpoint}
        isEditing={isEditing}
        currentEndpoint={currentEndpoint}
      />

      <CustomSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={closeSnackbar}
      />
    </div>
  );
};

export default Endpoints;
