export function generateCodeVerifier(): string {
  // Generate a random string between 43-128 characters
  const array = new Uint8Array(56);
  window.crypto.getRandomValues(array);
  return base64UrlEncode(array);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // Create code challenge using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  
  return base64UrlEncode(new Uint8Array(digest));
}

function base64UrlEncode(array: Uint8Array): string {
  // Convert array to base64 and make it URL safe
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}