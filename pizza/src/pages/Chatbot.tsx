import React, { useState, useRef } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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
    const currentMessage = userInput;
    setChatHistory(prev => [...prev, { type: 'user', message: currentMessage }]);
    setUserInput(''); // Clear input after sending

    try {
      // call Gemini API to get a response
      const result = await model.generateContent(currentMessage);
      const response = await result.response;
      console.log(response);

      // add Gemini's response to the chat history
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', message: response.text() },
      ]);
    } catch (error) {
      console.error('Gemini Chatbot: Error sending text message:', error);
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', message: 'Sorry, I encountered an error.' },
      ]);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  // Move blobToBase64 outside of sendAudioMessage to avoid dependency issues
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1]); // Get base64 part
        } else {
          reject(new Error('Failed to convert blob to base64 string'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const sendAudioMessage = React.useCallback(async (audioBlob: Blob) => {
    setIsLoading(true);

    try {
      const audioBase64 = await blobToBase64(audioBlob);
      let transcribedText: string;

      // Step 1: Transcribe the audio
      try {
        const transcriptionResult = await model.generateContent([
          { inlineData: { data: audioBase64, mimeType: audioBlob.type || 'audio/webm' } },
          { text: "Transcribe this audio to text. Provide only the transcription." }
        ]);
        const transcriptionResponse = await transcriptionResult.response;
        transcribedText = transcriptionResponse.text();
        if (!transcribedText.trim()) {
            transcribedText = "[Audio contained no speech or could not be transcribed]";
        }
      } catch (transcriptionError) {
        console.error('Gemini Chatbot: Error transcribing audio:', transcriptionError);
        transcribedText = "[Audio transcription failed]";
      }

      // Add transcribed user message to chat history
      setChatHistory(prev => [...prev, { type: 'user', message: transcribedText }]);

      // Step 2: Get the bot's response to the transcribed text
      try {
        const responseResult = await model.generateContent(transcribedText);
        const botResponse = await responseResult.response;
        setChatHistory(prev => [
          ...prev,
          { type: 'bot', message: botResponse.text() },
        ]);
      } catch (responseError) {
        console.error('Gemini Chatbot: Error getting bot response for audio:', responseError);
        setChatHistory(prev => [
          ...prev,
          { type: 'bot', message: 'Sorry, I had trouble responding to your audio.' },
        ]);
      }

    } catch (e) { // Catch errors from blobToBase64 or other top-level issues
      console.error('Gemini Chatbot: General error in sendAudioMessage:', e);
      setChatHistory(prev => [...prev, { type: 'user', message: "[Error processing audio]" }]);
      setChatHistory(prev => [
        ...prev,
        { type: 'bot', message: 'Sorry, there was an error processing your audio.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [model, setIsLoading, setChatHistory]);

  const startRecording = async () => {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/webm' });
        sendAudioMessage(audioBlob);
        stream.getTracks().forEach(track => track.stop()); // Stop microphone access
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      // Handle microphone permission denial or other errors
      alert('Could not access microphone. Please ensure permission is granted.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
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
          disabled={isLoading || isRecording}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-red-600 text-white hover:bg-accent focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading || isRecording || userInput.trim() === ''}
        >
          Send
        </button>
        <button
          className={`px-4 py-2 ml-2 rounded-lg text-white focus:outline-none ${
            isRecording ? 'bg-red-700 hover:bg-red-800' : 'bg-blue-500 hover:bg-blue-600'
          }`}
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isLoading}
        >
          {isRecording ? 'Stop Recording' : 'Record Audio'}
        </button>
      </div>
      <button
        className="mt-4 block px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 focus:outline-none"
        onClick={clearChat}
        disabled={isLoading || isRecording}
      >
        Clear Chat
      </button>
    </div>
  );
}
