import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  MessageCircle,
  X,
  Send,
  Briefcase,
  BookOpen,
  GraduationCap,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function App() {
  const [currentPage, setCurrentPage] = useState("signup");
  const [studentData, setStudentData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const messagesEndRef = useRef(null);

  const predefinedPrompts = [
    {
      icon: <Briefcase className="w-5 h-5" />,
      title: "Best career options after Class 10",
      prompt:
        "What are the best career options available for me after completing Class 10?",
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "How to choose a stream",
      prompt:
        "How should I choose between Science, Commerce, and Arts streams after Class 10?",
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Vocational courses after Class 10",
      prompt: "What vocational courses can I pursue after Class 10?",
    },
  ];

  // ✅ track window width safely
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      class: formData.get("class"),
      interests: formData.get("interests"),
      location: formData.get("location"),
    };

    try {
      const response = await axios.post(`${API_URL}/students/register`, data);
      setStudentData(response.data.student);
      setCurrentPage("landing");
    } catch (error) {
      console.error("Signup error:", error);
      alert("Failed to register. Please try again.");
    }
  };

  // ✅ Save chat messages to backend
  const saveChat = async (updatedMessages) => {
    if (!studentData?._id) return;
    try {
      await axios.post(`${API_URL}/chat/save`, {
        studentId: studentData._id,
        messages: updatedMessages,
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  // ✅ Send message handler
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = { role: "user", content: messageText };
    const updatedUserMessages = [...messages, userMessage];
    setMessages(updatedUserMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat`, {
        message: messageText,
        studentData,
      });

      const botMessage = {
        role: "assistant",
        content: response.data.response,
      };

      const updatedMessages = [...updatedUserMessages, botMessage];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        role: "assistant",
        content:
          "Sorry, I'm having trouble connecting. Please try again later.",
      };
      const updatedMessages = [...updatedUserMessages, errorMessage];
      setMessages(updatedMessages);
      saveChat(updatedMessages);
    }

    setIsLoading(false);
  };

  // ✅ Open chat via predefined prompt
  const openChatWithPrompt = (prompt) => {
    setIsChatOpen(true);
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: `Hello ${studentData.name}! 👋 I'm your career guidance assistant. I see you're interested in ${studentData.interests}. Let's get started!`,
        },
      ]);
    }
    setTimeout(() => {
      handleSendMessage(prompt);
    }, 500);
  };

  // ✅ New: toggleChat adds greeting when opened manually
  const toggleChat = () => {
    setIsChatOpen((prev) => {
      const newState = !prev;
      if (newState && messages.length === 0 && studentData) {
        setMessages([
          {
            role: "assistant",
            content: `Hello ${studentData.name}! 👋 I'm your career guidance assistant. How can I help you today?`,
          },
        ]);
      }
      return newState;
    });
  };

  // --- Signup Page ---
  if (currentPage === "signup") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
        <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Career Guidance Bot
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              For Class 10 Students
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            {["name", "interests", "location"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {field === "name"
                    ? "Full Name"
                    : field === "interests"
                    ? "Your Interests"
                    : "Location"}
                </label>
                <input
                  type="text"
                  name={field}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
                  placeholder={
                    field === "interests"
                      ? "e.g., Science, Technology, Art"
                      : field === "location"
                      ? "Your city"
                      : "Enter your name"
                  }
                />
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                name="class"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                <option value="10">Class 10</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition shadow-lg text-sm sm:text-base"
            >
              Get Started
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- Landing + Chat Page ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 relative">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
          Welcome, {studentData.name}! 🎓
        </h1>
        <p className="text-gray-600 mb-6 text-sm sm:text-base">
          Choose a topic below to start your personalized career guidance chat.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {predefinedPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => openChatWithPrompt(item.prompt)}
              className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 w-full"
            >
              <div className="flex flex-col items-center space-y-3">
                <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-800 text-base sm:text-lg">
                  {item.title}
                </h3>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ✅ Floating Chat Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-indigo-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        {isChatOpen ? <X /> : <MessageCircle />}
      </button>

      {/* ✅ Chat Window */}
      {isChatOpen && (
        <div
          className={`fixed bottom-20 right-4 sm:right-6 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
            windowWidth < 640 ? "w-[90%] h-[70vh]" : "w-80 h-[500px]"
          }`}
        >
          <div className="bg-indigo-600 text-white p-4 flex justify-between items-center">
            <h3 className="font-semibold text-sm sm:text-base">Career Bot</h3>
            <button onClick={() => setIsChatOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 text-sm sm:text-base">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg max-w-[85%] break-words ${
                  msg.role === "user"
                    ? "bg-indigo-100 self-end ml-auto"
                    : "bg-gray-100"
                }`}
              >
                {msg.content}
              </div>
            ))}
            {isLoading && (
              <div className="text-gray-500 text-sm italic">Typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 border-t flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border-none rounded-lg px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
            >
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
