"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { setTokens } from "@/lib/auth";

export default function CallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const fetchTokens = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      console.log("URL Params:", urlParams.toString());
      const code = urlParams.get("code");
      console.log("Code:", code);

      if (!code) return;

      console.log("Fetching tokens...");
      const redirect_uri = "http://localhost:3000/auth/callback";

      try {
        const response = await fetch("http://localhost:8000/api/token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setTokens(data.access_token, data.refresh_token);
          router.push("/redirect"); // or home page
        } else {
          const errorText = await response.text();
          console.error("Login failed:", response.status, errorText);
          alert(`Login failed: ${response.status} ${errorText}`);
        }
      } catch (error) {
        console.error("Error during token exchange:", error);
        alert("Error during login process");
      }
    };

    fetchTokens();
  }, [router]);

  return <p>Authenticating...</p>;
}
