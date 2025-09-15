import React, { useState } from "react";

const LiveChatToggle = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat Circle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 w-14 h-14 rounded-full bg-purple-600 text-white text-2xl flex items-center justify-center shadow-lg hover:bg-purple-700 transition z-50"
        aria-label={open ? "Close chat" : "Open chat"}
      >
        {open ? "×" : "💬"}
      </button>

      {/* Chat Box */}
      {open && (
        <div className="fixed bottom-20 right-5 w-80 h-[400px] bg-gray-900 rounded-lg shadow-lg text-white z-40 flex flex-col">
          <div className="p-3 border-b border-gray-700 font-semibold">
            Live Chat Help
          </div>

          <div className="flex-grow p-3 overflow-y-auto">
            {/* Chat messages would go here */}
            <p>Chat content...</p>
          </div>

          <div className="flex items-center p-3 border-t border-gray-700">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow px-3 py-2 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <button
              className="ml-3 px-4 py-2 bg-purple-600 rounded-md hover:bg-purple-700 transition"
              type="button"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LiveChatToggle;
