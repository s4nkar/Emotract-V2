import React, { useState } from "react";
import { Search, User, Send, Smile, Paperclip, Mic, MoreVertical, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import "../styles.css";

const ChatInterface = ({ onNavigate }) => {
  const contacts = [
    { id: 1, name: "Gus Skarlis", email: "gus@example.com" },
    { id: 2, name: "Shahin Alam", email: "shahin@example.com" },
    { id: 3, name: "Honsara Beg", email: "honsara@example.com" },
    { id: 4, name: "Milli Akter", email: "milli@example.com" },
  ];

  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there!", sender: "other", timestamp: "10:00 AM", date: "Feb 15" },
    { id: 2, text: "😀😁😂", sender: "me", timestamp: "10:01 AM", date: "Feb 15" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim() || selectedFile) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          text: selectedFile ? selectedFile.name : newMessage,
          sender: "me",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
          file: selectedFile ? URL.createObjectURL(selectedFile) : null,
        },
      ]);
      setNewMessage("");
      setSelectedFile(null);
    }
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
          <div className="menu-container">
            <button onClick={() => setShowMenu(!showMenu)} className="menu-button">
              <MoreVertical size={24} />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <p>Starred Messages</p>
                <p>Archived Chats</p>
                <p onClick={onNavigate} className="menu-item">Settings</p>
                <p>Profile</p>
              </div>
            )}
          </div>
        </div>
        <div className="search-box">
          <Search size={20} />
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
        <div className="contacts">
          {contacts.map((contact) => (
            <div key={contact.id} className="contact" onClick={() => setSelectedContact(contact)}>
              <User size={24} />
              <span>{contact.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="chat-window">
        <div className="chat-header">
          <User size={32} />
          <div className="contact-info">
            <h3>{selectedContact.name}</h3>
            <p>{selectedContact.email}</p>
          </div>
        </div>
        <div className="messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === "me" ? "sent" : "received"}`}>
              {msg.text}
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="message-input"
          />
          <button onClick={handleSendMessage} className="send-button">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
