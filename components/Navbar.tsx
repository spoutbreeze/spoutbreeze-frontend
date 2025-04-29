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
          <Link href="/login">
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
          </Link>
      </div>
    </nav>
  );
};

export default Navbar;
