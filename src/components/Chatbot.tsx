import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage } from '../types';
import { getClientFallbackReply } from '../data/knowledge';

interface ChatbotProps {
  onShowToast: (message: string, icon?: string) => void;
}

export const Chatbot: React.FC<ChatbotProps> = ({ onShowToast }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      role: 'assistant',
      text: "Hi there! I am Rajesh's portfolio assistant. How can I help you learn more about his data analytics and automation services?"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const formatText = (text: string) => {
    let formatted = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Auto-link emails
    formatted = formatted.replace(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
      '<a href="mailto:$1" class="text-terracotta underline font-semibold">$1</a>'
    );

    // Auto-link URLs
    formatted = formatted.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-terracotta underline font-semibold">$1</a>'
    );

    // Line breaks
    formatted = formatted.replace(/\n/g, '<br />');

    return { __html: formatted };
  };

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    if (text.length > 600) {
      onShowToast('Message exceeds allowed length of 600 characters.', '⚠️');
      return;
    }

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (!response.ok) {
        throw new Error('API server returned error');
      }

      const data = await response.json();
      const reply = data.reply || getClientFallbackReply(text);

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          text: reply,
        }
      ]);
    } catch {
      // Seamless zero-latency offline fallback
      const fallbackReply = getClientFallbackReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          text: fallbackReply,
        }
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend();
  };

  const presets = [
    "What services do you offer?",
    "Tell me about your Excel dashboard project.",
    "Are you available for freelance work?",
    "How can I contact Rajesh?"
  ];

  return (
    <aside aria-label="Freelance Assistant Chatbot" className="clay-chatbot-wrapper">
      {/* Floating Toggle Button */}
      <button
        id="chatToggleBtn"
        className="clay-chat-toggle-btn"
        aria-expanded={isOpen}
        aria-controls="chatDialog"
        aria-label="Open portfolio AI chat"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="chat-toggle-sparkle">✨</span>
        <span className="chat-toggle-text">Ask about Rajesh's Work</span>
        <span className="chat-status-pulse"></span>
      </button>

      {/* Chat Modal Window */}
      {isOpen && (
        <div
          id="chatDialog"
          className="clay-chat-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-heading"
        >
          {/* Chat Header */}
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-header-avatar">
                <img src="/assets/rajesh-profile.png" alt="Rajesh S I" className="chat-avatar-mini" />
                <span className="avatar-online-dot"></span>
              </div>
              <div>
                <h2 id="chat-heading" className="chat-header-title">Rajesh S I — Assistant</h2>
                <p className="chat-header-sub">Data Analytics &amp; Automation</p>
              </div>
            </div>
            <button
              id="chatCloseBtn"
              className="chat-close-btn"
              aria-label="Close Chat"
              type="button"
              onClick={() => setIsOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Messages Body */}
          <div className="chat-messages-body" id="chatMessages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-msg ${msg.role}`}>
                <div 
                  className="chat-bubble"
                  dangerouslySetInnerHTML={formatText(msg.text)}
                />
              </div>
            ))}

            {isLoading && (
              <div className="chat-msg assistant">
                <div className="typing-dots">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Preset Prompts */}
          {messages.length <= 2 && (
            <div className="chat-preset-container" id="chatPresets">
              <span className="preset-label">Suggested queries:</span>
              <div className="preset-chips">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    className="preset-chip"
                    onClick={() => handleSend(preset)}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input & Action Bar */}
          <form className="chat-input-bar" id="chatForm" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="text"
              id="chatInput"
              className="chat-input-field"
              placeholder="Ask a question about Rajesh's work..."
              maxLength={600}
              autoComplete="off"
              aria-label="Your question"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <button
              type="submit"
              id="chatSendBtn"
              className="chat-send-btn"
              aria-label="Send message"
              disabled={isLoading || !inputText.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      )}
    </aside>
  );
};
