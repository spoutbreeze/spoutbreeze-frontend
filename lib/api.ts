import { getSession } from "next-auth/react";
import axios from "axios";
import { access } from "fs";

export async function fetchProtectedData() {
  try {
    const session = await getSession();
    
    if (!session?.accessToken) {
      throw new Error("Not authenticated");
    }
    
    // Log token details for debugging
    console.log("Token structure:", {
      length: session.accessToken.length,
      firstChars: session.accessToken.substring(0, 10),
      containsDots: session.accessToken.includes('.')
    });

    // Add this to your fetchProtectedData function
    console.log("Session content:", {
      hasAccessToken: !!session.accessToken,
      hasUser: !!session.user,
      user: session.user,
      expiresAt: session.expires
    });
    
    // Important: This matches what OAuth2AuthorizationCodeBearer expects
    const response = await axios.get("http://localhost:8000/api/protected", {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      },
      withCredentials: true
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", response.headers);
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw new Error(`Failed to fetch data: ${error.response?.status} ${error.message}`);
    } else {
      console.error("Unexpected error:", error);
      throw error;
    }
  }
}