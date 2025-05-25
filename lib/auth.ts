import {
  KEYCLOAK_SERVER_URL,
  KEYCLOAK_REALM,
  KEYCLOAK_CLIENT_ID,
  KEYCLOAK_REDIRECT_URI,
} from "@/config";
import { generateCodeVerifier, generateCodeChallenge } from "./pkce";

// Generate PKCE values
export const initPKCE = async () => {
  // Generate and store PKCE values
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store code verifier in localStorage or sessionStorage
  sessionStorage.setItem("code_verifier", codeVerifier);

  return { codeVerifier, codeChallenge };
};


export const getLoginUrl = async () => {
  // Initialize PKCE
  const { codeChallenge } = await initPKCE();

  const url = `${KEYCLOAK_SERVER_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${KEYCLOAK_CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(
    KEYCLOAK_REDIRECT_URI ?? ""
  )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  console.log("codeChallenge", codeChallenge);
  console.log("url", url);
  return url;
};

// Send code to FastAPI backend for token exchange
export const exchangeCodeForToken = async (code: string) => {
  // Get the stored code verifier
  const codeVerifier = sessionStorage.getItem("code_verifier");

  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  // Call your FastAPI backend endpoint
  const response = await fetch("http://localhost:8000/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      redirect_uri: KEYCLOAK_REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to exchange code for token");
  }

  const data = await response.json();
  setTokens(data.access_token, data.refresh_token);
  return data;
};

export const getToken = () => {
  return localStorage.getItem("access_token");
};

export const setTokens = (access_token: string, refresh_token: string) => {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("refresh_token", refresh_token);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  sessionStorage.removeItem("code_verifier");
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  
  console.log("Refresh token from storage:", refresh_token ? "exists" : "missing"); // Debug log
  
  if (!refresh_token) return null;

  try {
    const response = await fetch("http://localhost:8000/api/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    // Log the response details for debugging
    console.log("Refresh response status:", response.status);
    
    if (!response.ok) {
      // Get the error details from the response
      const errorData = await response.text();
      console.error("Refresh failed with status:", response.status);
      console.error("Error details:", errorData);
      
      // If it's a 401, the refresh token is invalid/expired
      if (response.status === 401) {
        console.log("Refresh token expired or invalid - clearing tokens");
        clearTokens();
        return null;
      }
      
      throw new Error(`Failed to refresh token: ${response.status}`);
    }

    const data = await response.json();
    console.log("Refresh response:", data); // Debug log
    
    if (data.access_token) {
      // Update tokens (refresh_token might be rotated)
      const newRefreshToken = data.refresh_token || refresh_token;
      setTokens(data.access_token, newRefreshToken);
      return data.access_token;
    } else {
      throw new Error("No access token in refresh response");
    }
  } catch (error) {
    console.error("Refresh token error:", error);
    clearTokens();
    return null;
  }
};
