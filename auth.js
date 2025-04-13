import { google } from "googleapis";

export async function authorize() {
  try {
    const credentials = JSON.parse(process.env.GOOGLE_CREDENTIAL);
    const client = google.auth.fromJSON(credentials);
    return client;
  } catch (err) {
    console.error("❌ Failed to load credentials from GOOGLE_CREDENTIALS:", err.message);
    throw err;
  }
}