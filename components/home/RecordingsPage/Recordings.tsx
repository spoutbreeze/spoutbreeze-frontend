"use client";

import React, { useEffect, useState } from "react";
import { getRecordings, Recording } from "@/actions/recordings";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";
import Image from "next/image";
import { useGlobalSnackbar } from "@/contexts/SnackbarContext";

const Recordings: React.FC = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { showSnackbar } = useGlobalSnackbar();

  useEffect(() => {
    const fetchRecordingsData = async () => {
      try {
        const data = await getRecordings();
        setRecordings(data.recordings);
        setLoading(false);
      } catch (error) {
        console.error("Detailed error:", error);
        setError("Failed to fetch recordings");
        showSnackbar("Failed to fetch recordings", "error");
        setLoading(false);
      }
    };
    fetchRecordingsData();
  }, []);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = parseInt(startTime);
    const end = parseInt(endTime);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / (1000 * 60));
    const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlaybackClick = (url: string) => {
    // Clean the URL by removing extra whitespace and newlines
    const cleanUrl = url.trim().replace(/\s+/g, '');
    window.open(cleanUrl, '_blank');
  };

  return (
    <div className="px-10 pt-10 h-screen overflow-y-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-[18px] font-medium text-black mb-[20px]">
          Recordings
        </h1>
      </div>

      <TableContainer>
        <Table>
          <TableHead className="bg-[#F6F6F6]">
            <TableRow sx={{ "& th": { py: "10px", borderBottom: "none" } }}>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                NAME
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                DATE
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                DURATION
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                USERS
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                FORMAT
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: "15px", borderBottom: "none" }}
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                  sx={{ py: "15px", borderBottom: "none" }}
                >
                  {error}
                </TableCell>
              </TableRow>
            ) : recordings.length === 0 ? (
              <TableRow
                sx={{ "& td": { py: "15px", px: 0, borderBottom: "none" } }}
              >
                <TableCell colSpan={5} align="center">
                  No recordings available
                </TableCell>
              </TableRow>
            ) : (
              recordings.map((recording) => (
                <TableRow
                  key={recording.recordID}
                  sx={{
                    "&:nth-of-type(even)": {
                      backgroundColor: "#F6F6F6",
                    },
                    "& td": { py: "15px", borderBottom: "none" },
                  }}
                >
                  <TableCell>{recording.meetingID}</TableCell>
                  <TableCell>{formatDate(recording.startTime)}</TableCell>
                  <TableCell>
                    {calculateDuration(recording.startTime, recording.endTime)}
                  </TableCell>
                  <TableCell>{recording.participants}</TableCell>
                  <TableCell>
                    <Box className="flex items-center justify-start">
                      <Image
                        src="/mp4_icon.svg"
                        alt="MP4"
                        width={39}
                        height={17}
                        className="cursor-pointer"
                        onClick={() => handlePlaybackClick(recording.playback.format.url)}
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Recordings;
