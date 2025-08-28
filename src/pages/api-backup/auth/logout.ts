import type { APIRoute } from "astro";
import { clearAuthCookie } from "../../../lib/auth";

export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: "Method not allowed. Use POST to logout." }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
};

export const POST: APIRoute = async () => {
  const cookie = clearAuthCookie();
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
  });
};
