import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const ChatBot = () => {
  const messagesEndRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Auto scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessage = { sender: "user", text: userInput };
    setMessages((prev) => [...prev, newMessage]);
    setUserInput("");

    try {
      const res = await axios.post("https://shopmate-w739.onrender.com/api/chat", {
        message: userInput,
      });

      const botReply = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botReply]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error: Unable to respond" },
      ]);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full bg-pink-500 text-white text-xl flex items-center justify-center shadow-lg hover:bg-purple-600 transition"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? "❌" : "💬"}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 w-80 max-h-[400px] h-80 bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg rounded-lg flex flex-col z-50">
          <div className="px-4 py-2 border-b border-gray-300 dark:border-gray-700 font-semibold bg-purple-500 text-white">
            🤖 Chat with us
          </div>

          <div className="flex-grow overflow-y-auto p-3 space-y-2 text-sm scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg w-fit max-w-[85%] ${
                  msg.sender === "user"
                    ? "bg-purple-500 text-white text-right ml-auto"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white text-left mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex border-t border-gray-900 dark:border-gray-300 p-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full py-2 pr-12 pl-4 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-gray-100 dark:bg-gray-900"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="absolute bg-purp hover:bg-purple-600 text-white rounded-r-md px-4 py-2 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
