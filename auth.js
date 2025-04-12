import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/youtube.force-ssl"];

export async function authorize() {
    const client = new google.auth.OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        process.env.REDIRECT_URI
    );

    client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN,
    });

    return client;
}