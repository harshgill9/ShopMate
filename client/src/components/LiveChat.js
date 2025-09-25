import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL); // Backend socket.io URL

const LiveChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
    };
  }, []);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const messageData = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date().toISOString(),
    };
    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg flex flex-col">
      <div className="p-3 border-b border-gray-300 dark:border-gray-700 font-semibold">
        Live Chat Help
      </div>

      <div
        className="flex-grow p-3 overflow-y-auto"
        style={{ maxHeight: "300px" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-300 dark:border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-grow border border-gray-300 dark:border-gray-700 rounded px-2 py-1 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default LiveChat;
