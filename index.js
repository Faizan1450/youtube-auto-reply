import fs from "fs";
import { google } from "googleapis";
import { authorize } from "./auth.js";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const batchInfo = fs.readFileSync("UpcomingBatches.txt", "utf8");
const context = fs.readFileSync("Context.txt", "utf8");
const contentYT = fs.readFileSync("YoutubeSeries.txt", "utf8");
let currentDate = new Date().toLocaleDateString()
currentDate = `Today's current Date is: ${currentDate}`

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateReply(comment, commenterName, historyBlock = "") {
  const prompt = `${context}\n\n${currentDate}\n\n${batchInfo}\n\n${contentYT}\n\n${historyBlock}Comment by ${commenterName}\n\nComment: ${comment}\n\nReply:`;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    // model: "gemini-2.0-flash-lite",
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
    maxResults: 15,
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
    await youtube.comments.insert({
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
