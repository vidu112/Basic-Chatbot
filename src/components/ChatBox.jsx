import { useState, useContext, useEffect, useRef } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function ChatBox() {
  const { token, logout } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const bottomRef               = useRef(null);

  // 1) Load this user’s history on mount
  useEffect(() => {
    async function fetchHistory() {
      try {
        const res = await api.get("/chat", {
          headers: { Authorization: `Bearer ${token}` },
          params: { sessionId: "default" }
        });
        const msgs = res.data.messages.map(msg => ({
          sender: msg.role === "user" ? "user" : "bot",
          text: msg.content
        }));
        setMessages(msgs);
      } catch (err) {
        console.error("Failed to load chat history:", err);
      }
    }
    fetchHistory();
  }, [token]);

  // 2) Auto-scroll when messages update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3) Sending a new message
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Show user message immediately
    setMessages(prev => [...prev, { sender: "user", text: input }]);

    try {
      const { data } = await api.post(
        "/chat",
        { message: input, sessionId: "default" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(prev => [...prev, { sender: "bot", text: data.reply }]);
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