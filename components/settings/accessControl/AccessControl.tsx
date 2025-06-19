"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Select,
  MenuItem,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { fetchUsers, fetchCurrentUser, User, getPrimaryRole } from "@/actions/fetchUsers";
import { updateUserRole } from "@/actions/manageUsers";
import { useGlobalSnackbar } from "@/contexts/SnackbarContext";

const AccessControl: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const { showSnackbar } = useGlobalSnackbar();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersData, currentUserData] = await Promise.all([
          fetchUsers(),
          fetchCurrentUser()
        ]);
        setUsers(usersData);
        setCurrentUser(currentUserData);
      } catch (error) {
        console.error("Failed to load data:", error);
        showSnackbar("Failed to load users data", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [showSnackbar]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!currentUser) return;

    // Prevent user from changing their own role
    if (userId === currentUser.id) {
      showSnackbar("You cannot change your own role", "error");
      return;
    }

    setUpdating(userId);
    
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      
      // Update the users list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? updatedUser : user
        )
      );
      
      showSnackbar("User role updated successfully", "success");
    } catch (error: any) {
      console.error("Failed to update user role:", error);
      
      let errorMessage = "Failed to update user role";
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showSnackbar(errorMessage, "error");
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const canChangeRole = (user: User) => {
    if (!currentUser) return false;
    if (user.id === currentUser.id) return false;
    
    // Only allow changing roles for moderators and admins
    const userRoles = user.roles?.split(',').map(r => r.trim()) || [];
    return userRoles.some(role => ['admin', 'moderator'].includes(role));
  };

  const getCurrentRole = (user: User) => {
    const userRoles = user.roles?.split(',').map(r => r.trim()) || [];
    if (userRoles.includes('admin')) return 'admin';
    if (userRoles.includes('moderator')) return 'moderator';
    return 'user';
  };

  return (
    <Box className="py-10 px-10">
      <h2 className="text-xl font-medium mb-2">Access Control</h2>
      <p className="text-gray-600 mb-6">
        Manage users across the platform.
      </p>

      <TableContainer>
        <Table>
          <TableHead className="bg-[#F6F6F6]">
            <TableRow sx={{ "& th": { py: "10px", borderBottom: "none" } }}>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                NAME
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                EMAIL
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                ROLE
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                JOINED
              </TableCell>
              <TableCell sx={{ color: "#5B5D60", fontWeight: 500 }}>
                STATUS
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
            ) : users.filter(user => user.id !== currentUser?.id).length === 0 ? (
              <TableRow
                sx={{ "& td": { py: "15px", px: 0, borderBottom: "none" } }}
              >
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users
                .filter(user => user.id !== currentUser?.id)
                .map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#F6F6F6",
                      },
                      "& td": { py: "15px", borderBottom: "none" },
                    }}
                  >
                    <TableCell>
                      {user.first_name} {user.last_name}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {canChangeRole(user) ? (
                        <FormControl size="small" disabled={updating === user.id}>
                          <Select
                            value={getCurrentRole(user)}
                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                            sx={{
                              minWidth: 120,
                              "& .MuiSelect-select": {
                                py: "6px",
                                fontSize: "14px",
                              },
                            }}
                          >
                            <MenuItem value="moderator">Moderator</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </Select>
                          {updating === user.id && (
                            <CircularProgress
                              size={16}
                              sx={{
                                position: "absolute",
                                right: 30,
                                top: "50%",
                                marginTop: "-8px",
                              }}
                            />
                          )}
                        </FormControl>
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 rounded text-sm">
                          {getPrimaryRole(user)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.created_at)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded text-sm ${
                          user.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.is_active ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AccessControl;