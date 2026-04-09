import { createAuthClient } from "@neondatabase/neon-js/auth";
// export const authClient = createAuthClient(
//     import.meta.env.VITE_NEON_AUTH_URL
// )

const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL;

if (!neonAuthUrl) {
  throw new Error("VITE_NEON_AUTH_URL is not set");
}

export const authClient = createAuthClient(neonAuthUrl);
