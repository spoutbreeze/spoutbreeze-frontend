"use client";

import Image from "next/image";
import Link from "next/link";
import Button from "@mui/material/Button";
import { getLoginUrl } from "@/lib/auth";

const handleLogin = () => {
  window.location.href = getLoginUrl();
};

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 flex items-center justify-between px-6 pt-[13px] pb-[17px] border-b border-[#E0E5EC] bg-white z-10">
      <div className="flex items-center">
        <Link href="/home" className="ml-[100px]">
          <Image
            src="/spoutbreeze_icon.svg"
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
      </div>
      <div className="flex items-center justify-end mr-[100px]">
          <Link href="/login">
              <Button
                variant="outlined"
                sx={{
                  padding: "12px",
                  color: "#27AAFF",
                  borderColor: "#27AAFF",
                }}
                onClick={handleLogin}
              >
                Sign in
              </Button>
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
