import React from "react";
import Chip from "@mui/material/Chip";

interface LiveBadgeProps {
  show: boolean;
  variant?: "default" | "pulse";
}

const LiveBadge: React.FC<LiveBadgeProps> = ({ show, variant = "default" }) => {
  if (!show) return null;

  return (
    <Chip
      label="LIVE"
      size="small"
      sx={{
        backgroundColor: "#ff4444",
        color: "white",
        fontSize: "10px",
        fontWeight: "bold",
        height: "20px",
        borderRadius: "10px",
        "& .MuiChip-label": {
          padding: "0 8px",
        },
        ...(variant === "pulse" && {
          animation: "pulse 2s infinite",
          "@keyframes pulse": {
            "0%": {
              opacity: 1,
            },
            "50%": {
              opacity: 0.7,
            },
            "100%": {
              opacity: 1,
            },
          },
        }),
      }}
    />
  );
};

export default LiveBadge;