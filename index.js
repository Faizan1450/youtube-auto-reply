import fs from "fs";
import { google } from "googleapis";
import { authorize } from "./auth.js";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const batchInfo = fs.readFileSync("UpcomingBatches.txt", "utf8");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const CONTEXT = `
You are the smart, friendly assistant of the SCALive YouTube channel.
Reply like a human in simple, easy-to-understand and in engaging language.

Language guide:
- If the comment is in Hindi or Hinglish (Hindi tone, English letters), then reply in Hinglish (English letters).
- If the comment is in English, reply naturally in English, Human Like tone.

Tone guide:
1. If the comment is positive, appreciative, or asks doubts — reply supportively and personally, ideally using the name.
2. If the comment is rude, mocking, or tries to provoke — respond with wit, sarcasm, and humor. Use a cheeky, clever tone without being disrespectful. Feel free to turn their logic upside down for fun.
3. If the comment is vague or unclear (e.g., just a timestamp or short phrase), politely ask them to clarify instead of assuming anything.

Always include the following CTA at the end of replies where the user is seeking more information or clarity:
📌 For any Queries or Complaints visit:
Contact us:- 07314853128
Email:- info@scalive.in
Telegram Channel:- https://t.me/scaofficialchannel

Note: 
- If a previous conversation is provided, first understand the full context of that thread and reply accordingly to continue the conversation naturally.
- If no previous conversation is provided, reply directly based on the latest comment alone.
- While replying to the comment, don't mention the comment explicitly. Just give a natural human reply.
${batchInfo}
`;

async function generateReply(comment, commenterName, historyBlock = "") {
  const prompt = `${CONTEXT}\n\n${historyBlock}Comment by ${commenterName}\n\nComment: ${comment}\n\nReply:`;
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });
  return response.text.trim();
}


async function replyToComments() {
  const auth = await authorize();
  const youtube = google.youtube({ version: "v3", auth });

  const channelRes = await youtube.commentThreads.list({
    part: "snippet",
    allThreadsRelatedToChannelId: process.env.CHANNEL_ID,
    maxResults: 10,
    order: "time",
  });

  const comments = channelRes.data.items || [];

  for (const commentThread of comments) {
    const commentId = commentThread.id;
    let commentText = commentThread.snippet.topLevelComment.snippet.textDisplay;
    const commenterName = commentThread.snippet.topLevelComment.snippet.authorDisplayName;
    const totalReplies = commentThread.snippet.totalReplyCount;

    let historyBlock = "";
    if (totalReplies > 0) {
      const repliesRes = await youtube.comments.list({
        part: "snippet",
        parentId: commentId,
        maxResults: 10,
      });

      const replies = repliesRes.data.items || [];
      if (replies.length === 0) continue;

      const lastReply = replies[replies.length - 1];
      const lastAuthor = lastReply.snippet.authorDisplayName;
      if (lastAuthor === process.env.CHANNEL_NAME) {
        continue; // Skip if last message is from us
      }

      // Build conversation history
      let threadHistory = [`${commenterName}: ${commentText}`];
      for (const r of replies) {
        const name = r.snippet.authorDisplayName;
        const text = r.snippet.textDisplay.replace(/\n/g, ' ');
        threadHistory.push(`${name}: ${text}`);
      }

      historyBlock = `Previous Conversation:\n${threadHistory.join('\n')}\n\n`;
      commentText = lastReply.snippet.textDisplay
    }

    const reply = await generateReply(commentText, commenterName, historyBlock);
    const insertResponse = await youtube.comments.insert({
      part: "snippet",
      requestBody: {
        snippet: {
          parentId: commentId,
          textOriginal: reply,
        },
      },
    });


    console.log("Commenter Name: ", commenterName)
    console.log("Comment: ", commentText)
    console.log("Reply:", reply);
    console.log("========================================================================");
  }
}

replyToComments();
