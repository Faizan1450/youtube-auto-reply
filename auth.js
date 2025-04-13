import { google } from "googleapis";

export async function authorize() {
  // Pull in the full JSON string from GitHub Secrets
  const raw = process.env.GOOGLE_CREDENTIALS;
  if (!raw) {
    throw new Error("Missing env var GOOGLE_CREDENTIALS");
  }

  let credentials;
  try {
    credentials = JSON.parse(raw);
  } catch (err) {
    console.error("Invalid JSON in GOOGLE_CREDENTIALS:", err.message);
    throw err;
  }

  // Now build the client from that JSON
  const client = google.auth.fromJSON(credentials);
  client.scopes = ["https://www.googleapis.com/auth/youtube.force-ssl"];
  return client;
}