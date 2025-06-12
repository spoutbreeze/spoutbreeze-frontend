import React, { useState } from "react";
import { 
  Typography, 
  Box, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField 
} from "@mui/material";

const DeleteAccount: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");

  const handleContinue = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setPassword("");
  };

  const handleConfirmDelete = () => {
    // Add your delete account logic here
    console.log("Account deletion confirmed with password:", password);
    // Close modal after processing
    handleClose();
  };

  return (
    <Box className="p-6">
      <Typography variant="h5" className="mb-4 text-[#262262]">
        Delete Account
      </Typography>
      
      <Box className="w-1/2">
        <Typography variant="body1" className="mb-6 text-gray-700 leading-relaxed">
          Permanently deleting your account will remove all your data, your profile, 
          your channels, and any uploaded recordings. This action is irreversible, 
          and you won&apos;t be able to recover your account or any associated information.
        </Typography>
        
        <Button 
          variant="contained" 
          color="error" 
          onClick={handleContinue}
          sx={{ textTransform: 'none' }}
        >
          Continue
        </Button>
      </Box>

      {/* Confirmation Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          Confirm Account Deletion
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" className="mb-4">
            To confirm that you want to delete your account, please enter your password:
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error" 
            variant="contained"
            disabled={!password.trim()}
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DeleteAccount;