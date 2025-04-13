# SCALive YouTube Auto Reply Bot 🤖

A Node.js application that automatically replies to comments on the SCALive YouTube channel using Google Gemini AI and the YouTube Data API. It generates context-aware, human-like responses in English or Hinglish.

---

## 🚀 Features

- **Smart Replies**: Witty, supportive, or clarifying responses via Gemini AI  
- **Thread Context**: Continues conversations by fetching comment history  
- **Language Detection**: Replies in English or Hinglish based on the comment  
- **Scheduled Automation**: Runs every 8 hours via GitHub Actions  
- **Batch Info Injection**: Reads upcoming batch details from `UpcomingBatches.txt`  
- **Secure Configuration**: Credentials and API keys managed via GitHub Secrets  

---

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/youtube-auto-reply.git
   cd youtube-auto-reply
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure GitHub Secrets**  
   In your repository settings, add the following under **Settings → Secrets and Variables → Actions**:
   - `GOOGLE_CREDENTIALS` (JSON string with `type`, `client_id`, `client_secret`, `refresh_token`)  
   - `GEMINI_API_KEY`  
   - `YOUTUBE_API_KEY`  
   - `CHANNEL_ID`  
   - `CHANNEL_NAME`  

4. **(Optional) Local Development**  
   Create a `.env` file for local testing:
   ```env
   GOOGLE_CREDENTIALS='{"type":"authorized_user","client_id":"...","client_secret":"...","refresh_token":"..."}'
   GEMINI_API_KEY=your-gemini-key
   YOUTUBE_API_KEY=your-youtube-key
   CHANNEL_ID=UC...
   CHANNEL_NAME=Your Channel Name
   ```

---

## ⚙️ Usage

### Local Run
```bash
node index.js
```

### GitHub Actions
The bot runs automatically every 8 hours.  
To trigger manually:
1. Go to the **Actions** tab.  
2. Select **YouTube Auto Reply Bot**.  
3. Click **Run workflow**.

---

## 📂 Project Structure

```
.
├── index.js                   # Main bot logic
├── auth.js                    # OAuth2 helper (uses env secrets)
├── UpcomingBatches.txt        # Batch details injected into replies
├── .github/
│   └── workflows/
│       └── auto-reply.yml     # GitHub Actions configuration
├── package.json
└── README.md
```

---

## 📬 Contact Developer

- Name: Syed Faizan Ali  
- Phone: 9770093064  
- Email: syedfaizanali1450@gmail.com  
