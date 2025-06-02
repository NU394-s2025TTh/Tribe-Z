// Using copilot test instructions from .github/copilot-test-instructions.md
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import Chatbot from './Chatbot';

vi.mock('firebase/ai', () => {
  const generateContentMock = vi.fn(async (input: string) => {
    if (input === 'fail') {
      throw new Error('Simulated API failure');
    }
    return {
      response: { text: () => `Echo: ${input}` },
    };
  });

  return {
    getAI: vi.fn(() => ({})),
    getGenerativeModel: vi.fn(() => ({
      generateContent: generateContentMock,
    })),
    GoogleAIBackend: vi.fn(),
  };
});
vi.mock('../components/sections/ChatHistory', () => ({
  default: ({ chatHistory }: any) => (
    <div data-testid="chat-history">
      {chatHistory.map((msg: any, i: number) => (
        <div key={i}>{msg.type}: {msg.message}</div>
      ))}
    </div>
  ),
}));
vi.mock('../components/sections/Loading', () => ({
  default: ({ isLoading }: any) => (
    isLoading ? <div data-testid="loading">Loading...</div> : null
  ),
}));

// Clear mocks between tests
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Chatbot', () => {
  it('renders input and send button', () => {
    render(<Chatbot />);
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('does not send empty messages', () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByText('Send'));
    expect(screen.queryByTestId('chat-history')).toBeInTheDocument();
    expect(screen.queryByText(/user:/)).not.toBeInTheDocument();
  });

  it('sends a message and displays bot response', async () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.click(screen.getByText('Send'));
    await waitFor(() => expect(screen.getByText('user: Hello')).toBeInTheDocument());
    expect(screen.getByText('bot: Echo: Hello')).toBeInTheDocument();
  });

  it('shows loading indicator while waiting for response', async () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Test' } });
    fireEvent.click(screen.getByText('Send'));
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByTestId('loading')).not.toBeInTheDocument());
  });

  it('clears chat when Clear Chat is clicked', async () => {
    render(<Chatbot />);
    const input = screen.getByPlaceholderText('Type your message...');
    fireEvent.change(input, { target: { value: 'Hi' } });
    fireEvent.click(screen.getByText('Send'));
    await waitFor(() => expect(screen.getByText('user: Hi')).toBeInTheDocument());
    fireEvent.click(screen.getByText('Clear Chat'));
    expect(screen.queryByText('user: Hi')).not.toBeInTheDocument();
  });

  describe('handleUserInput', () => {
    it('updates userInput state', () => {
      render(<Chatbot />);
      const input = screen.getByPlaceholderText('Type your message...') as HTMLInputElement;
      fireEvent.change(input, { target: { value: 'Pizza' } });
      expect(input.value).toBe('Pizza');
    });
  });

  describe('sendMessage', () => {
    it('disables send button while loading', async () => {
      render(<Chatbot />);
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'Loading test' } });
      fireEvent.click(screen.getByText('Send'));
      expect(screen.getByText('Send')).toBeDisabled();
      await waitFor(() => expect(screen.getByText('Send')).not.toBeDisabled());
    });
    it('logs error if API fails', async () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(<Chatbot />);
      const input = screen.getByPlaceholderText('Type your message...');
      fireEvent.change(input, { target: { value: 'fail' } });
      fireEvent.click(screen.getByText('Send'));

      await waitFor(() =>
        expect(errorSpy).toHaveBeenCalledWith(
          expect.stringContaining('Gemini Chatbot: Error sending message')
        )
      );

      errorSpy.mockRestore();
    });
  });
});
