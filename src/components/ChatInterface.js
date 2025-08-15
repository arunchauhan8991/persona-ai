"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TeacherToggle from "./TeacherToggle";
import TypingIndicator from "./TypingIndicator";
import { getTeachers } from "../utils/personas";

export default function ChatInterface() {
  const [currentTeacher, setCurrentTeacher] = useState("hitesh");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState({
    hitesh: [],
    piyush: [],
  });
  const messagesEndRef = useRef(null);
  const teachers = getTeachers();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    setMessages(chatHistory[currentTeacher]);
  }, [currentTeacher, chatHistory]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { role: "user", content: inputMessage };
    const newMessages = [...messages, userMessage];

    setMessages(newMessages);
    setChatHistory((prev) => ({
      ...prev,
      [currentTeacher]: newMessages,
    }));
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          teacher: currentTeacher,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const aiMessage = { role: "assistant", content: data.message };
      const updatedMessages = [...newMessages, aiMessage];

      setMessages(updatedMessages);
      setChatHistory((prev) => ({
        ...prev,
        [currentTeacher]: updatedMessages,
      }));
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage = {
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      };
      const updatedMessages = [...newMessages, errorMessage];
      setMessages(updatedMessages);
      setChatHistory((prev) => ({
        ...prev,
        [currentTeacher]: updatedMessages,
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const switchTeacher = (teacher) => {
    setCurrentTeacher(teacher);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="teacher-info">
          <img
            src={teachers[currentTeacher].image}
            alt={teachers[currentTeacher].name}
            className="profile-pic"
          />
          <div className="teacher-details">
            <h3>{teachers[currentTeacher].name}</h3>
            <div className="online-status">
              <div className="green-dot"></div>
              Online
            </div>
          </div>
        </div>

        <TeacherToggle
          currentTeacher={currentTeacher}
          onTeacherSwitch={switchTeacher}
        />
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <MessageBubble key={index} message={message} />
        ))}
        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={`Message ${teachers[currentTeacher].name}...`}
          className="message-input"
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !inputMessage.trim()}
          className="send-btn"
        >
          Send
        </button>
      </div>
    </div>
  );
}
