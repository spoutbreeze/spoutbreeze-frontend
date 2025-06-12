import * as React from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Stack from "@mui/material/Stack";
import { CreateChannelReq } from "@/actions/channels";

interface AddChannelModalProps {
  open: boolean;
  onClose?: () => void;
  onAdd?: (formData: CreateChannelReq) => void;
}

const AddChannelModal: React.FC<AddChannelModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [formData, setFormData] = React.useState<CreateChannelReq>({
    name: "",
  });
  const [errors, setErrors] = React.useState({
    name: false,
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }));
    }
  };

  const handleSubmit = () => {
    if (formData.name.trim() === "") {
      setErrors((prev) => ({ ...prev, name: true }));
      return;
    }

    if (onAdd) {
      onAdd(formData);
    }

    setFormData({ name: "" });
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: "8px",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: "20px",
        }}
      >
        Create Channel
      </DialogTitle>
      <DialogContent>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Stack spacing={2} sx={{ mt: 1 }}>
            <FormControl fullWidth>
              <TextField
                autoFocus
                required
                id="name"
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter channel name"
                error={errors.name}
                helperText={errors.name ? "Channel name is required" : ""}
                variant="outlined"
              />
            </FormControl>
          </Stack>
        </form>
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
        <Button
          onClick={handleSubmit}
          variant="outlined"
          sx={{
            padding: "10px",
            fontSize: "14px",
            fontWeight: 500,
            textTransform: "none",
            color: "#27AAFF",
            borderColor: "#27AAFF",
          }}
        >
          Create Channel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddChannelModal;
