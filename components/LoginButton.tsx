// components/LoginButton.tsx
"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect } from 'react';
import { fetchProtectedData } from '../lib/api';


export default function LoginButton() {
  const { data: session } = useSession();
  console.log("Session user:", session?.user);
  console.log("Session expires:", session?.expires);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchProtectedData();
        console.log("Protected data fetched successfully:", data);
      } catch (error) {
        console.error("Error in component:", error);
      }
    }
    
    fetchData();
  }, []);

  if (session) {
    return (
      <button onClick={() => signOut()}>
        Logout
      </button>
    );
  }
  
  return (
    <button onClick={() => signIn("keycloak")}>
      Login with Keycloak
    </button>
  );
}