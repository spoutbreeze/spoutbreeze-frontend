import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { getShareableJoinUrl } from "@/utils/joinUrl"; // Add this import
import { useGlobalSnackbar } from "@/contexts/SnackbarContext";

interface JoinUrlDialogProps {
  open: boolean;
  onClose: () => void;
  eventId: string; // Change from joinUrls to eventId
  eventTitle: string;
}

const JoinUrlDialog: React.FC<JoinUrlDialogProps> = ({
  open,
  onClose,
  eventId, // Change from joinUrls to eventId
  eventTitle,
}) => {
  const { showSnackbar } = useGlobalSnackbar();

  const handleCopyUrl = async (role: 'attendee' | 'moderator') => {
    try {
      const shareableUrl = getShareableJoinUrl(eventId, role);
      await navigator.clipboard.writeText(shareableUrl);
      showSnackbar(`${role === 'moderator' ? 'Moderator' : 'Attendee'} URL copied to clipboard!`, "success");
      onClose();
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      showSnackbar("Failed to copy URL to clipboard.", "error");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "18px",
        }}
      >
        Copy Join URL - {eventTitle}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Choose which join URL you want to copy:
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Attendee URL */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Attendee Link
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              For participants joining the event
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="text"
                value={getShareableJoinUrl(eventId, 'attendee')}
                readOnly
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #27AAFF",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => handleCopyUrl('attendee')}
                style={{
                  padding: "8px",
                  border: "1px solid #27AAFF",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#27AAFF",
                }}
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
              </button>
            </Box>
          </Box>

          {/* Moderator URL */}
          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
              Moderator Link
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
              For hosts with control permissions
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="text"
                value={getShareableJoinUrl(eventId, 'moderator')}
                readOnly
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #27AAFF",
                  borderRadius: "4px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                onClick={() => handleCopyUrl('moderator')}
                style={{
                  padding: "8px",
                  border: "1px solid #27AAFF",
                  borderRadius: "4px",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#27AAFF",
                }}
              >
                <ContentCopyOutlinedIcon sx={{ fontSize: 16 }} />
              </button>
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            padding: "10px",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            backgroundColor: "#CCCCCC",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#CCCCCC",
              boxShadow: "none",
            },
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default JoinUrlDialog;