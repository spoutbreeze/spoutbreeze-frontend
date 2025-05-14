import * as React from "react";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import Stack from "@mui/joy/Stack";
import Add from "@mui/icons-material/Add";
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
    <React.Fragment>
      <Modal open={open} onClose={onClose}>
        <ModalDialog>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "20px",
            }}
          >
            Create Channel
          </DialogTitle>
          <form
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
            <Stack spacing={2}>
              <FormControl error={errors.name}>
                <FormLabel>Name</FormLabel>
                <Input 
                  autoFocus 
                  required 
                  id="name" 
                  name="name" 
                  type="text" 
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter channel name"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-1">
                    Channel name is required
                  </div>
                )}
              </FormControl>
              <Button type="submit">Submit</Button>
            </Stack>
          </form>
        </ModalDialog>
      </Modal>
    </React.Fragment>
  );
};

export default AddChannelModal;
