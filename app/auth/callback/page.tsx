"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { exchangeCodeForToken } from "@/lib/auth";

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const code = searchParams.get("code");

    if (code && typeof code === "string") {
      exchangeCodeForToken(code)
        .then(() => {
          router.push("/home"); // Redirect to your app's main page
        })
        .catch((err) => {
          console.error(err);
          setError("Authentication failed. Please try again.");
        });
    }
  }, [searchParams, router]);

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return <div className="p-4">Authenticating...</div>;
}
