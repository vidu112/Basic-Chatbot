// src/components/ChatBox.jsx
import { useState, useContext, useEffect, useRef } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function ChatBox() {
  const { token, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  // auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // show user message immediately
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // call protected chat endpoint with access token
      const { data } = await api.post(
        "/chat",
        { message: input, sessionId: "default" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setInput("");
    }
  };

  return (
    <div className="w-full h-full">
      <div className="max-w-xl mx-auto p-4">
        {/* Sign Out button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={logout}
            className="btn text-sm bg-red-600 hover:bg-transparent hover:text-red-600 transition"
          >
            Sign Out
          </button>
        </div>

        {/* Chat window */}
        <div className="h-96 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`my-2 ${
                msg.sender === "user" ? "text-right" : "text-left"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300"
                }`}
              >
                {msg.text}
              </span>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="flex mt-4">
          <input
            className="flex-grow p-2 border rounded-l-lg text-black"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r-lg"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
