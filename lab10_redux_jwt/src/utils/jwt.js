// Small helpers to DECODE (not verify) a JWT in the browser.
// A JWT is three base64url-encoded parts joined by dots:
//   header.payload.signature
// The frontend can read the payload, but only the server (which owns
// the secret) can verify the signature.

function base64UrlDecode(str) {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const json = decodeURIComponent(
    atob(base64)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(json);
}

export function decodeJwt(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    return {
      header: base64UrlDecode(parts[0]),
      payload: base64UrlDecode(parts[1]),
      signature: parts[2],
      raw: parts,
    };
  } catch {
    return null;
  }
}

export function isExpired(decoded) {
  if (!decoded?.payload?.exp) return true;
  return decoded.payload.exp * 1000 <= Date.now();
}

export function secondsLeft(decoded) {
  if (!decoded?.payload?.exp) return 0;
  return Math.max(0, Math.floor(decoded.payload.exp * 1000 - Date.now()) / 1000);
}
