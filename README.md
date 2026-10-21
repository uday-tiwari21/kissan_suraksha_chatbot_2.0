# 🌾 KisaanSuraksha — AI-Powered Agricultural WhatsApp Chatbot

KisanSuraksha is an AI-powered agricultural assistance system designed to help farmers access agricultural information and crop damage assessment services through WhatsApp. It aims to make agricultural support accessible, multilingual, and available around the clock.

## 🚀 Features

- **AI-Powered Assistance:** Provides answers to farmers' agriculture-related questions using Google's Gemini AI.
- **WhatsApp Integration:** Enables farmers to interact with the chatbot through WhatsApp using Twilio.
- **Multilingual Support:** Designed to support farmers communicating in multiple Indian languages.
- **Voice-Based Interaction:** Intended to make agricultural assistance more accessible through voice commands.
- **Crop Damage Assessment Integration:** Designed to connect farmers with the KisanSuraksha crop damage assessment platform.
- **24/7 Availability:** Provides automated assistance whenever the service is running.

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** MongoDB
- **AI Integration:** Google Gemini API
- **WhatsApp Messaging:** Twilio WhatsApp API
- **Environment Configuration:** dotenv

## 📁 Project Structure

```text
backend/
├── .env                 # Environment variables (not committed)
├── package.json         # Project dependencies and scripts
├── package-lock.json    # Dependency lockfile
└── [application files]  # Server and route files
```

*The structure above is illustrative. Update it to match your actual project files.*

## ⚙️ Prerequisites

Before running the backend, install or configure:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- A MongoDB database, such as MongoDB Atlas
- Twilio account with WhatsApp access
- Google Gemini API key

## 📥 Installation

1. Clone or download the repository.
2. Open a terminal in the backend directory.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the backend directory and configure the required environment variables.

   Example:

   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_gemini_api_key
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   ```

   Use the exact variable names expected by your application. Add other required variables if your code needs them.

## ▶️ Run the Backend

Start the server using the script configured in `package.json`.

For example:

```bash
npm start
```

If your project uses a development script, you may instead run:

```bash
npm run dev
```

When the server starts successfully, the terminal should display a message similar to:

```text
Server running on http://localhost:5000
```

**Note:** A running server does not necessarily mean MongoDB, Gemini, or Twilio is connected successfully. Verify each service's connection and configuration separately.

## 🔐 Environment Variables and Security

- Never commit `.env` files containing API keys, database credentials, or authentication tokens.
- Add `.env` to `.gitignore`.
- Provide a `.env.example` file containing placeholder values for contributors.
- Keep all API credentials private and rotate any credentials accidentally exposed publicly.

## 🔗 Related Project

KisanSuraksha combines conversational agricultural assistance with a broader crop damage assessment platform.

- **Website repository:** [kissan_suraksha_website](https://github.com/uday-tiwari21/kissan_suraksha_website)
- **Chatbot repository:** [kissan_suraksha_chatbot_2.0](https://github.com/uday-tiwari21/kissan_suraksha_chatbot_2.0)

## 🎯 Project Goal

To empower farmers with accessible agricultural information and technology-assisted crop damage assessment, helping simplify access to agricultural support and compensation-related documentation.

