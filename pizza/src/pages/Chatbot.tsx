import React, { useState } from 'react';
import { app } from '../lib/firebase';
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai';
import ChatHistory, { ChatMessage } from '../components/sections/ChatHistory';
import Loading from '../components/sections/Loading';

// References used:
// Firebase AI Documentation: https://firebase.google.com/docs/ai-logic/get-started?authuser=0&api=dev
// Gemini Chatbot Tutorial: https://www.youtube.com/watch?v=nCEsIbfoLJM
// Corresponding Gemini Chatbot Tutorial Repo: https://github.com/luluCodingWizard/react-chatbot-gemini

export default function Chatbot() {
  const ai = getAI(app, { backend: new GoogleAIBackend() });
  const model = getGenerativeModel(ai, { model: 'gemini-2.0-flash' });
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  const sendMessage = async () => {
    // Prevent sending empty messages
    if (userInput.trim() === '') return;

    // Let the user know to wait for a response
    setIsLoading(true);

    try {
      // call Gemini API to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;
      console.log(response);

      // add Gemini's response to the chat history
      setChatHistory([
        ...chatHistory,
        { type: 'user', message: userInput },
        { type: 'bot', message: response.text() },
      ]);
    } catch {
      console.error('Gemini Chatbot: Error sending message');
    } finally {
      // Reset user input and loading state
      setUserInput('');
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-4">Chatbot</h1>

      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
      >
        Clear Chat
      </button>
    </div>
  );
}
