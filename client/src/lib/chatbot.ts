// Simple chatbot service for frontend use
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatSession {
  messages: ChatMessage[];
  isOpen: boolean;
}

// Initial bot greeting message
export const initialBotMessage: ChatMessage = {
  id: 'initial',
  content: 'Hello! Welcome to Borabyte. How can I help you today?',
  sender: 'bot',
  timestamp: new Date()
};

// Send message to backend API
export async function sendMessage(message: string): Promise<string> {
  try {
    const response = await fetch('/api/chatbot/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send message');
    }

    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending message:', error);
    return "I'm sorry, I'm having trouble connecting to the server. Please try again later.";
  }
}

// Generate a unique ID for each message
export function generateMessageId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
