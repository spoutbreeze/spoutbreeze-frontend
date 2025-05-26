"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import { getLoginUrl } from "@/lib/auth";
import { User, fetchCurrentUser } from "@/actions/fetchUsers";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { stringToColor } from "@/utils/userAvatarColor";
import { clearTokens } from "@/lib/auth";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { logout } from "@/actions/logout";

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
      width: 40,
      height: 40,
    },
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
}

const handleLogin = async () => {
  window.location.href = await getLoginUrl();
};

const Navbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [logoutSuccess, setLogoutSuccess] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [logoutStatusCode, setLogoutStatusCode] = useState<number | null>(null);

  const handleLogoutClick = async () => {
    setLogoutLoading(true);
    setLogoutError(null);

    try {
      const response = await logout();

      if (response.statusCode === 200) {
        setLogoutSuccess(true);
        setLogoutMessage(response.message);
        // Redirect after successful logout
        window.location.href = "/";
      } else {
        setLogoutError(response.message || "Logout failed");
      }
    } catch (error) {
      setLogoutError("Failed to log out");
      console.error("Logout error:", error);
    } finally {
      setLogoutLoading(false);
      setAnchorEl(null); // Close the menu
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsClick = () => {
    router.push("/settings");
    setAnchorEl(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      const userData = await fetchCurrentUser();
      setUser(userData);
      setLoading(false);
    };

    checkAuth();

    // Check for token in URL after Keycloak callback
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("access_token", token);
      // Remove token from URL for security reasons
      const newUrl = pathname;
      router.replace(newUrl);
      checkAuth(); // Fetch user data again with the new token
    }
  }, [pathname, searchParams, router]);

  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between pt-[13px] pb-[17px] border-b border-[#E0E5EC] bg-white z-10">
      <div className="ml-[100px]">
        <Link href="/" className="">
          <Image
            src="/spoutbreeze_icon.svg"
            alt="Logo"
            width={50}
            height={50}
            className="h-[30px] w-[30px] sm:h-[40px] sm:w-[40px] md:h-[50px] md:w-[50px] object-contain cursor-pointer"
          />
        </Link>
      </div>
      <div className="flex items-center justify-end mr-[100px]">
        {loading ? (
          // Loading state
          <Box
            sx={{ width: 120, height: 36, bgcolor: "#f0f0f0", borderRadius: 1 }}
          />
        ) : user ? (
          <>
            <Stack
              direction="row"
              spacing={1}
              className="items-center"
              onClick={handleClick}
              sx={{
                cursor: "pointer",
              }}
            >
              <Avatar
                {...stringAvatar(`${user.first_name} ${user.last_name}`)}
              />
              <div className="flex flex-col">
                <span className="text-[14px]">
                  {user.first_name} {user.last_name}
                </span>
                <span className="text-[13px] font-medium text-[#5B5D60]">
                  Admin
                </span>
              </div>
            </Stack>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                list: {
                  sx: {
                    padding: 0,
                    margin: 0,
                  },
                },
                paper: {
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    minWidth: "250px",
                    borderRadius: "8px",
                    "& .MuiAvatar-root": {
                      width: 40,
                      height: 40,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* User info section */}
              <Box sx={{ pb: "14px", pl: "14px", pt: "14px" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Avatar
                    {...stringAvatar(`${user.first_name} ${user.last_name}`)}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {user.first_name} {user.last_name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "13px" }}
                    >
                      {user.email || "foulenfalteli@blasa.bled"}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />

              {/* Menu options */}
              <MenuItem
                onClick={handleSettingsClick}
                disableGutters
                dense
                sx={{ pl: "14px", pt: "15px", pb: "15px" }}
              >
                <ListItemIcon>
                  <SettingsOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Settings
              </MenuItem>
              <MenuItem
                onClick={handleLogoutClick}
                disableGutters
                dense
                sx={{ pl: "14px", pt: "15px", pb: "15px" }}
              >
                <ListItemIcon>
                  <LogoutOutlinedIcon fontSize="small" />
                </ListItemIcon>
                Sign out
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            variant="outlined"
            sx={{
              padding: {
                xs: "8px 8px",
                sm: "10px 10px",
                md: "12px 12px",
              },
              fontSize: {
                xs: "12px",
                sm: "12px",
                md: "13px",
              },
              fontWeight: 500,
              color: "#27AAFF",
              borderColor: "#27AAFF",
            }}
            onClick={handleLogin}
          >
            Sign in
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
