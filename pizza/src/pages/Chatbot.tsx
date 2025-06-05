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
      const result = await model.generateContent([
        ...chatHistory.map((msg) => msg.message),
        userInput,
      ]);

      const response = await result.response;
      console.log(response);

      // add Gemini's response to the chat history
      setChatHistory([
        ...chatHistory,
        { role: 'user', message: userInput },
        { role: 'model', message: response.text() },
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
    <div className="container mx-auto px-4">
      <div className="py-8">
        <h1 className="text-2xl text-center center sm:text-3xl md:text-4xl font-bold text-accent">
          Ask Sensei{' '}
          <span role="img" aria-label="pizza">
            🍕
          </span>
        </h1>
        <p className="text-lg text-center">Chat with our chatbot!</p>
      </div>

      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <form
        className="flex mt-4 gap-2"
        onSubmit={e => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-accent hover:text-accent-foreground cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={isLoading || !userInput.trim()}
        >
          Send
        </button>
        <button
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 cursor-pointer focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={e => {
            e.preventDefault();
            clearChat();
          }}
          type="button"
          disabled={chatHistory.length === 0}
        >
          Clear
        </button>
      </form>
    </div>
  );
}
