import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  
  if (!session?.accessToken) {
    return res.status(401).json({ error: "No token found" });
  }
  
  // Token analysis
  const tokenParts = session.accessToken.split('.');
  let decodedPayload = null;
  
  if (tokenParts.length === 3) {
    try {
      decodedPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    } catch (e) {
      decodedPayload = { error: "Failed to decode payload" };
    }
  }
  
  // Never expose the full token in production!
  res.status(200).json({
    tokenStructure: {
      length: session.accessToken.length,
      parts: tokenParts.length,
      isJWT: tokenParts.length === 3
    },
    payload: decodedPayload ? {
      iss: decodedPayload.iss,
      sub: decodedPayload.sub,
      aud: decodedPayload.aud,
      exp: decodedPayload.exp,
      iat: decodedPayload.iat,
      preferred_username: decodedPayload.preferred_username,
      // Other fields sanitized
    } : null
  });
}