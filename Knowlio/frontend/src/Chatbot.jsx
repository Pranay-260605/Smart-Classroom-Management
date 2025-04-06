import React, { useState } from 'react';
import axios from 'axios';

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...messages, { sender: 'User', text: userInput }];
    setMessages(newMessages);

    try {
      const res = await axios.post('http://127.0.0.1:5000/chat', {
        message: userInput,
      });

      setMessages([...newMessages, { sender: 'Knowlio', text: res.data.response }]);
    } catch (err) {
      setMessages([...newMessages, { sender: 'Knowlio', text: "Error: Could not reach server." }]);
    }

    setUserInput('');
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <div style={{ maxWidth: '600px' }}>
      <div
        style={{
          border: '1px solid #ccc',
          padding: '10px',
          height: '400px',
          overflowY: 'auto',
          marginBottom: '10px',
          backgroundColor: '#f9f9f9',
          borderRadius: '5px'
        }}
      >
        {messages.map((msg, i) => (
          <div key={i} style={{ marginBottom: '8px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <input
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Ask something academic..."
        style={{ width: '80%', padding: '8px', borderRadius: '4px' }}
      />
      <button onClick={sendMessage} style={{ padding: '8px 12px', marginLeft: '5px' }}>
        Send
      </button>
    </div>
  );
};

export default Chatbox;
