# SCALive YouTube Auto Reply Bot 🤖

This Node.js bot uses Google Gemini AI to auto-reply to comments on SCALive’s YouTube channel with natural, witty, and context-aware responses.

---

## Features

- Human-like replies using Gemini AI (Hinglish & English)
- Handles full comment threads with conversation context
- Skips replies if the last message is already from the channel
- Pulls batch info from `batchInfo.txt` for promo replies
- Logs replies in `replyLog.json` for transparency

---

## Setup

1. Install dependencies
   ```bash
   npm install
   ```

2. Configure `.env`
   ```env
   YOUTUBE_API_KEY=your-api-key
   GEMINI_API_KEY=your-api-key
   CHANNEL_ID=your-channel-id
   CHANNEL_NAME=Your Channel Name
   ```

3. Add batch details to `batchInfo.txt`

---

## Run the Bot

```bash
node index.js
```

---

## Contact

📧 info@scalive.in  
📞 07314853128  
🔗 [Telegram](https://t.me/scaofficialchannel)
