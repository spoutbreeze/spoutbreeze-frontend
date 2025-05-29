import React, { useEffect, useState } from "react";
import { Typography, Box, TextField, CircularProgress } from "@mui/material";
import { fetchCurrentUser, User } from "@/actions/fetchUsers";

const AccountInfo: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  if (loading) {
    return (
      <Box className="py-10 pl-10">
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Account Info
        </Typography>
        <Box className="flex justify-center mt-4">
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="py-10 pl-10">
      <Typography variant="h5" sx={{ fontWeight: 500 }}>
        Account Info
      </Typography>
      <Typography variant="body1" className="text-gray-600 mb-6">
        Manage your account preferences and profile information.
      </Typography>

      <Box className="space-y-4 max-w-md">
        <TextField
          label="First Name"
          value={user?.first_name || ""}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <TextField
          label="Last Name"
          value={user?.last_name || ""}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <TextField
          label="Email"
          value={user?.email || ""}
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />

        <TextField
          label="Role"
          value="Admin"
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AccountInfo;
