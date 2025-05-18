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

const Navbar:React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated
      const userData = await fetchCurrentUser();
      setUser(userData);
      setLoading(false);
    };

    checkAuth();
    
    // Check for token in URL after Keycloak callback
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('access_token', token);
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
          // User is authenticated - show name, role and avatar
          <Stack direction="row" spacing={1} className="items-center">
            <Avatar {...stringAvatar(`${user.first_name} ${user.last_name}`)} />
            <div className="flex flex-col">
              <span className="text-[14px]">
                {user.first_name} {user.last_name}
              </span>
              <span className="text-[13px] font-medium text-[#5B5D60]">Admin</span>
            </div>
          </Stack>
        ) : (
          // User is not authenticated - show sign in button
          // <Link href="/login">
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
          // </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
