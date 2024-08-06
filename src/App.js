import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [isUsernameSubmitted, setIsUsernameSubmitted] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setIsUsernameSet(true);
    }

    socket.on('message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleUsernameSubmit = () => {
    localStorage.setItem('username', username);
    setIsUsernameSubmitted(true);
  };

  const handleMessageSend = () => {
    if (!inputMessage.trim()) return;

    socket.emit('message', {
      username,
      text: inputMessage
    });

    setInputMessage('');
  };

  return (
    <div className="app-container">
      {!isUsernameSubmitted ? (
        <div className="login-container">
          <div className="login-card">
            <h5 className="text-center mb-4">Chat App</h5>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={handleUsernameSubmit}
            >
              Set Username
            </button>
          </div>
        </div>
      ) : (
        <div className="chat-container">
          <div className="sidebar">
            <h4 className="sidebar-title">Welcome, {username}!</h4>
            {/* Add contact list or chat groups here */}
          </div>
          <div className="chat-window">
            <div className="chat-header">
              <h5>Chat</h5>
            </div>
            <div className="message-container">
              {messages.map((msg, index) => (
                <div key={index} className={`message ${msg.username === username ? 'sent' : 'received'}`}>
                  <strong>{msg.username}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Enter your message..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleMessageSend}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
