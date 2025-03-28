/* eslint-disable react/no-unknown-property */
import { useState, useRef, useEffect } from "react";

const GeminiChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    // Add user message
    const userMessage = {
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    const formattedMessage = `
    Người dùng: ${newMessage}
    Bạn là chuyên gia về thú cưng. Hãy đưa ra câu trả lời chi tiết, cụ thể và dễ hiểu. Nếu câu hỏi không rõ ràng, hãy hỏi lại hoặc gợi ý thông tin bổ sung.
    Trả lời ngắn gọn, dễ hiểu và có thể sử dụng emoji nếu phù hợp.
    `;
    console.log(formattedMessage);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "HTTP-Referer":
              "https://pet-community-platform-frontend.vercel.app/", // Optional
            "X-Title": "Pet Community Platform", // Optional
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-chat:free",
            messages: [{ role: "user", content: formattedMessage }], // Pass user message
          }),
        }
      );

      console.log(response);

      const data = await response.json();
      console.log(data);

      let aiResponse = data.choices?.[0]?.message?.content?.trim() || "";
      setMessages((prev) => [
        ...prev,
        { text: aiResponse, sender: "ai", timestamp: new Date() },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Xin lỗi, có lỗi xảy ra. 🚨",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Chat button - always visible */}
      <button
        onClick={toggleChatbox}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
          isOpen
            ? "bg-gray-700 rotate-90"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        }`}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        )}
      </button>

      {/* Chat window - visible when isOpen is true */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-96 h-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
              <div>
                <h3 className="font-medium">AI Assistant</h3>
                <p className="text-xs text-white/80">
                  🟢 Online | Powered by AI
                </p>
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <h4 className="text-gray-800 font-medium mb-1">
                  How can I help you today?
                </h4>
                <p className="text-gray-500 text-sm">
                  Send a message to start chatting
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-2xl px-4 py-3 max-w-xs animate-messageIn ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "bg-white border border-gray-200 shadow-sm text-gray-800"
                      }`}
                    >
                      <div className="text-sm">{message.text}</div>
                      <div
                        className={`text-xs mt-1 ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-500"
                        }`}
                      >
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="rounded-2xl px-4 py-3 bg-white border border-gray-200 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 rounded-full bg-gray-300 animate-bounce"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-gray-100 p-4 bg-white"
          >
            <div className="flex items-center rounded-full border border-gray-300 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 px-3 py-1">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-transparent px-2 py-2 focus:outline-none text-gray-800"
              />
              <button
                type="submit"
                disabled={newMessage.trim() === ""}
                className={`rounded-full p-2 ${
                  newMessage.trim() === ""
                    ? "text-gray-400"
                    : "text-white bg-gradient-to-r from-blue-600 to-purple-600"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes messageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-messageIn {
          animation: messageIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default GeminiChatbox;
