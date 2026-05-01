import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

const defaultModel = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const preferredModels = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.5-pro",
  "gemini-2.0-flash-001",
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
];

const getApiKey = () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  return apiKey;
};

const buildClient = () => {
  return new GoogleGenerativeAI(getApiKey());
};

const formatProfile = (profile = {}) => {
  const lines = [
    `Name: ${profile.name || "Unknown"}`,
    `Aadhaar: ${profile.aadhar || "Unknown"}`,
    `DOB: ${profile.dob || "Unknown"}`,
    `Land Registration: ${profile.landReg || "Unknown"}`,
    `City/Village: ${profile.city || "Unknown"}`,
    `State: ${profile.state || "Unknown"}`,
    `Recent Issue: ${profile.reason || profile.issue || "Not provided"}`,
  ];
  return lines.join("\n");
};

const createModel = (client, modelName) =>
  client.getGenerativeModel({
    model: modelName,
    systemInstruction:
      "You are KisaanSuraksha Mitra, an agriculture support assistant for Indian farmers. Respond in friendly Hinglish (mix of Hindi and English) using simple words. Provide empathetic, practical advice referencing Indian farming context. Always add a brief reminder that final decisions should involve local agriculture officers or trusted experts. Keep answers within 6-8 sentences maximum.",
  });

const attemptGenerate = async (model, contents) => {
  const result = await model.generateContent({ contents });
  const text = result.response?.text?.().trim();
  if (!text) {
    throw new Error("Gemini returned empty response");
  }
  return text;
};

export const generateFarmerResponse = async (profile, history = [], question) => {
  const systemInstruction =
    "You are KisaanSuraksha Mitra, an agriculture support assistant for Indian farmers. Respond in friendly Hinglish (mix of Hindi and English) using simple words. Provide empathetic, practical advice referencing Indian farming context. Always add a brief reminder that final decisions should involve local agriculture officers or trusted experts. Keep answers within 6-8 sentences maximum.";

  // Build conversation context
  const profileText = `Farmer profile information:\n${formatProfile(profile)}\n\n`;
  const historyText = history
    .map((entry) => {
      if (!entry?.role || !entry?.text) return "";
      const prefix = entry.role === "bot" ? "Assistant: " : "Farmer: ";
      return `${prefix}${entry.text}`;
    })
    .join("\n\n");
  
  const fullPrompt = `${profileText}${historyText ? historyText + "\n\n" : ""}Farmer: ${question}\n\nAssistant:`;

  // First try SDK approach
  const client = buildClient();
  for (const modelName of preferredModels) {
    try {
      const formattedHistory = [];
      history.forEach((entry) => {
        if (!entry?.role || !entry?.text) return;
        const role = entry.role === "bot" ? "model" : "user";
        formattedHistory.push({ role, parts: [{ text: entry.text }] });
      });

      const contents = [
        {
          role: "user",
          parts: [
            {
              text: `Farmer profile information:\n${formatProfile(profile)}\n\nThe farmer will now ask a question. Please reply accordingly.`,
            },
          ],
        },
        ...formattedHistory,
        { role: "user", parts: [{ text: question }] },
      ];

      const model = createModel(client, modelName);
      return await attemptGenerate(model, contents);
    } catch (err) {
      console.warn(`SDK: Model ${modelName} failed: ${err.message?.substring(0, 100)}`);
      // Continue to next model or REST API
    }
  }

  // If SDK fails, try REST API with v1 endpoint
  console.log("Trying REST API fallback...");
  for (const modelName of preferredModels) {
    try {
      // Try v1 API first (more stable)
      const apiKey = getApiKey();
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
      
      const payload = {
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800, // Reduced to keep responses shorter for WhatsApp
        },
      };

      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        console.log(`✅ REST API success with ${modelName}`);
        return text;
      }
    } catch (err) {
      if (err.response?.status === 404) {
        console.warn(`REST v1: Model ${modelName} not found, trying v1beta...`);
        // Try v1beta as last resort
        try {
          const apiKey = getApiKey();
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          const payload = {
            contents: [{ parts: [{ text: fullPrompt }] }],
          };
          const response = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
          });
          const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            console.log(`✅ REST v1beta success with ${modelName}`);
            return text;
          }
        } catch (err2) {
          console.warn(`REST v1beta: Model ${modelName} failed: ${err2.response?.data?.error?.message || err2.message}`);
        }
      } else {
        console.warn(`REST API: Model ${modelName} error: ${err.response?.data?.error?.message || err.message}`);
      }
    }
  }

  throw new Error("Unable to generate response - all models and API endpoints failed. Please check your API key has access to Gemini models.");
};

/**
 * Map language codes to full language names for better prompt clarity
 */
const getLanguageName = (code) => {
  const langMap = {
    te: "Telugu",
    hi: "Hindi",
    ta: "Tamil",
    kn: "Kannada",
    mr: "Marathi",
    gu: "Gujarati",
    pa: "Punjabi",
    bn: "Bengali",
    or: "Odia",
    ml: "Malayalam",
    ur: "Urdu",
    en: "English",
  };
  return langMap[code?.toLowerCase()] || code || "the detected language";
};

/**
 * Generate agronomy-focused advice tailored to soil conditions and language.
 * @param {string} userMessage
 * @param {{soil_moisture?: number, soil_temp?: number}} agroData
 * @param {string} detectedLanguage - Language code from Sarvam AI (e.g., "te", "hi", "ta")
 * @returns {Promise<string>}
 */
export const generateResponse = async (
  userMessage,
  agroData = {},
  detectedLanguage = "en"
  ) => {
  const soilMoisture = Number(agroData?.soil_moisture);
  const soilTemp = agroData?.soil_temp;

  let soilCondition = "NORMAL";
  if (!Number.isNaN(soilMoisture)) {
    if (soilMoisture < 15) soilCondition = "DRY/CRITICAL";
    else if (soilMoisture > 35) soilCondition = "WET";
  }

  const languageName = getLanguageName(detectedLanguage);
  const isEnglish = detectedLanguage?.toLowerCase() === "en";

  // Build strict language-only prompt
  const prompt = [
    "You are KisaanSuraksha Bot, an expert Indian Agronomist helping smallholder farmers.",
    "",
    `User Query: ${userMessage}`,
    `Selected Language: ${detectedLanguage} (${languageName}) - farmer's preferred language`,
    "",
    `Soil Data: Moisture ${agroData?.soil_moisture ?? "unknown"}%, Temperature ${soilTemp ?? "unknown"}°C`,
    `Soil Condition: ${soilCondition}`,
    "",
    "CRITICAL LANGUAGE REQUIREMENTS:",
    `- You MUST respond ONLY in ${languageName} (${detectedLanguage})`,
    "- DO NOT use ANY English words, phrases, or code-switching",
    "- Use ONLY pure native vocabulary and expressions",
    "- Write in the native script/alphabet for this language",
    "- If technical terms are needed, use native equivalents or transliterations in native script",
    "- Keep the response natural and conversational, as if speaking to a local farmer",
    "",
    "Agricultural Advice:",
    "- If soil moisture is below 15%, advise immediate irrigation",
    "- Provide practical, actionable farming advice",
    "- Use simple words that farmers understand",
    "- Reference Indian farming context and practices",
    "",
    "IMPORTANT: Keep your response concise and within 1200 characters to ensure it can be sent via WhatsApp.",
    "",
    `Now respond to the farmer's query in ${languageName} ONLY, using pure native language with no English words:`,
  ].join("\n");

  // Create model with strict system instruction
  const systemInstruction = `You are KisaanSuraksha Bot, an expert Indian Agronomist. You respond to farmers in their native language ONLY. You NEVER use English words or code-switching. You use pure native vocabulary, proper script, and natural expressions that local farmers understand.`;

  const client = buildClient();

  for (const modelName of preferredModels) {
    try {
      const model = client.getGenerativeModel({ 
        model: modelName,
        systemInstruction: systemInstruction
      });
      const text = await attemptGenerate(model, [
        { role: "user", parts: [{ text: prompt }] },
      ]);
      if (text) return text;
    } catch (err) {
      console.warn(`SDK: Model ${modelName} failed: ${err.message?.substring(0, 120)}`);
    }
  }

  // REST fallback - include system instruction in prompt since REST API v1 doesn't support systemInstruction field
  const promptWithSystemInstruction = `${systemInstruction}\n\n${prompt}`;
  
  for (const modelName of preferredModels) {
    try {
      const apiKey = getApiKey();
      const url = `https://generativelanguage.googleapis.com/v1/models/${modelName}:generateContent?key=${apiKey}`;
      const payload = { 
        contents: [{ parts: [{ text: promptWithSystemInstruction }] }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 800, // Reduced to keep responses shorter for WhatsApp
        }
      };
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (text) {
        console.log(`✅ REST API v1 success with ${modelName}`);
        return text;
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // try v1beta - v1beta supports systemInstruction
        try {
          const apiKey = getApiKey();
          const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
          const payload = { 
            contents: [{ parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] }
          };
          const response = await axios.post(url, payload, {
            headers: { "Content-Type": "application/json" },
          });
          const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (text) {
            console.log(`✅ REST API v1beta success with ${modelName}`);
            return text;
          }
        } catch (err2) {
          console.warn(`REST v1beta: Model ${modelName} failed: ${err2.response?.data?.error?.message || err2.message}`);
        }
      } else {
        console.warn(`REST v1: Model ${modelName} error: ${err.response?.data?.error?.message || err.message}`);
      }
    }
  }

  // Return error message that will be handled by controller with proper language
  throw new Error("GEMINI_API_FAILED");
};

