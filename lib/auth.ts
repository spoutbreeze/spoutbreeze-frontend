const KEYCLOAK_BASE_URL = "http://localhost:8080/realms/spoutbreeze/";
const CLIENT_ID = "spoutbreezeAPI";
const REDIRECT_URI = "http://localhost:3000/auth/callback";

export const getLoginUrl = () => {
  const url = `${KEYCLOAK_BASE_URL}protocol/openid-connect/auth?client_id=${CLIENT_ID}&response_type=code&scope=openid&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}`;
  console.log("url", url);
  return url;
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
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem("refresh_token");
  if (!refresh_token) return null;

  try {
    const response = await fetch("http://localhost:8000/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) throw new Error("Failed to refresh token");

    const data = await response.json();
    setTokens(data.access_token, data.refresh_token);
    return data.access_token;
  } catch (error) {
    clearTokens();
    return null;
  }
};
