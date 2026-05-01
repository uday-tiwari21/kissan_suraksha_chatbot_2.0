import dotenv from "dotenv";
dotenv.config();   // must be at the top

import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Twilio WhatsApp message limit is 1600 characters
const MAX_MESSAGE_LENGTH = 1600;

/**
 * Split message into chunks that fit within Twilio's limit
 * Tries to split at sentence boundaries for better readability
 */
const splitMessage = (message) => {
  if (message.length <= MAX_MESSAGE_LENGTH) {
    return [message];
  }

  const chunks = [];
  let remaining = message;

  while (remaining.length > MAX_MESSAGE_LENGTH) {
    // Try to split at sentence boundaries (., !, ?, newline)
    let splitIndex = MAX_MESSAGE_LENGTH;
    const lastPeriod = remaining.lastIndexOf('.', MAX_MESSAGE_LENGTH);
    const lastExclamation = remaining.lastIndexOf('!', MAX_MESSAGE_LENGTH);
    const lastQuestion = remaining.lastIndexOf('?', MAX_MESSAGE_LENGTH);
    const lastNewline = remaining.lastIndexOf('\n', MAX_MESSAGE_LENGTH);

    // Find the best split point (prefer sentence endings)
    const bestSplit = Math.max(lastPeriod, lastExclamation, lastQuestion, lastNewline);
    
    if (bestSplit > MAX_MESSAGE_LENGTH * 0.7) {
      // Only use sentence boundary if it's not too early (at least 70% of max length)
      splitIndex = bestSplit + 1;
    } else {
      // If no good sentence boundary, split at word boundary
      const lastSpace = remaining.lastIndexOf(' ', MAX_MESSAGE_LENGTH);
      if (lastSpace > MAX_MESSAGE_LENGTH * 0.7) {
        splitIndex = lastSpace + 1;
      }
    }

    chunks.push(remaining.substring(0, splitIndex).trim());
    remaining = remaining.substring(splitIndex).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks;
};

export const sendMessage = async (to, message) => {
  try {
    if (!to.startsWith("whatsapp:")) to = `whatsapp:${to}`;
    
    // Split message if it exceeds Twilio's limit
    const chunks = splitMessage(message);
    
    if (chunks.length > 1) {
      console.log(`📨 Message exceeds limit, splitting into ${chunks.length} parts`);
    }

    // Send all chunks with small delay between them
    const responses = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      
      // Add part indicator if message is split
      const partIndicator = chunks.length > 1 ? `[${i + 1}/${chunks.length}]\n\n` : '';
      const messageToSend = partIndicator + chunk;
      
      const response = await client.messages.create({
        from: process.env.TWILIO_PHONE_NUMBER,
        to,
        body: messageToSend,
      });
      
      console.log(`Message sent (part ${i + 1}/${chunks.length}):`, response.sid);
      responses.push(response);
      
      // Small delay between messages to avoid rate limiting (except for last message)
      if (i < chunks.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500)); // 500ms delay
      }
    }
    
    return responses[0]; // Return first response for compatibility
  } catch (error) {
    console.error("Twilio sendMessage error:", error.message);
    throw error;
  }
};
