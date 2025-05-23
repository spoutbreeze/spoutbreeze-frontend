import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { User, fetchUsers } from "@/actions/fetchUsers";
import { stringToColor } from "@/utils/userAvatarColor";
import { Organizers } from "@/actions/events";

interface OrganizerSelectorProps {
  organizer_ids: string[];
  currentUser: User | null;
  onAddOrganizer: (organizer: string) => void;
  onRemoveOrganizer: (organizer: string) => void;
}

const OrganizerSelector: React.FC<OrganizerSelectorProps> = ({
  organizer_ids,
  currentUser,
  onAddOrganizer,
  onRemoveOrganizer,
}) => {
  const [open, setOpen] = useState(false);
  const [availableUsers, setAvailableUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Load selected users data based on IDs
  useEffect(() => {
    const loadSelectedUsers = async () => {
      const users = await fetchUsers();
      // Filter users whose IDs are in organizers array
      const selected = users.filter((user) => organizer_ids.includes(user.id));
      setSelectedUsers(selected);
    };

    loadSelectedUsers();
  }, [organizer_ids]);

  // Load available users when dialog opens
  useEffect(() => {
    if (open) {
      const loadUsers = async () => {
        const users = await fetchUsers();
        // Filter out users that are already organizers
        const filteredUsers = users.filter(
          (user) => !organizer_ids.includes(user.id)
        );
        setAvailableUsers(filteredUsers);
      };
      loadUsers();
    }
  }, [open, organizer_ids]);

  return (
    <div className="mb-6">
      <p className="text-sm font-medium mb-2">Organizers</p>
      <div className="flex flex-wrap gap-2">
        {/* Current user (always included) */}
        {currentUser && currentUser.first_name && (
          <Chip
            avatar={
              <Avatar
                sx={{
                  bgcolor: stringToColor(
                    `${currentUser.first_name} ${currentUser.last_name}`
                  ),
                }}
              >
                <span className="text-white">
                  {currentUser.first_name[0]}
                  {currentUser.last_name[0]}
                </span>
              </Avatar>
            }
            label={`${currentUser.first_name} ${currentUser.last_name}`}
            sx={{
              borderRadius: "17px",
              backgroundColor: "#F6F6F6",
            }}
          />
        )}

        {/* Other organizers */}
        {selectedUsers
          .filter((user) => (currentUser ? user.id !== currentUser.id : true))
          .map((user) => (
            <Chip
              key={user.id}
              avatar={
                <Avatar
                  sx={{
                    bgcolor: stringToColor(
                      `${user.first_name} ${user.last_name}`
                    ),
                  }}
                >
                  <span style={{ color: "white" }}>
                    {user.first_name[0]}
                    {user.last_name[0]}
                  </span>
                </Avatar>
              }
              label={`${user.first_name} ${user.last_name}`}
              onDelete={() => onRemoveOrganizer(user.id)}
              sx={{
                borderRadius: "17px",
                backgroundColor: "#F6F6F6",
              }}
            />
          ))}

        {/* Add organizer button */}
        <Chip
          icon={
            <AddIcon sx={{ backgroundColor: "#FFFFFF", borderRadius: "50px" }} />
          }
          label="Add organizer"
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: "17px",
            backgroundColor: "#F6F6F6",
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
          }}
        />
      </div>

      {/* User selection dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Select an Organizer</DialogTitle>
        <DialogContent dividers>
          {availableUsers.length === 0 ? (
            <p>No more users available to add</p>
          ) : (
            <List>
              {availableUsers.map((user) => (
                <ListItem
                  component="div"
                  key={user.id}
                  onClick={() => {
                    onAddOrganizer(user.id);
                    setOpen(false);
                  }}
                  sx={{ cursor: "pointer" }}
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: stringToColor(
                          `${user.first_name} ${user.last_name}`
                        ),
                      }}
                    >
                      <span style={{ color: "white" }}>
                        {user.first_name[0]}
                        {user.last_name[0]}
                      </span>
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${user.first_name} ${user.last_name}`}
                    secondary={user.email}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrganizerSelector;
