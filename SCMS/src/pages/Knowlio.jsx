import React, { useState } from "react";
import knowlioStyles from "../styles/Knowlio.module.css";
import knowlioLogo from "../assets/Knowlio_white.png";
import sendButton from "../assets/send-arrow.png"

const Knowlio = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  // const handleSend = () => {
  //   if (input.trim() === "") return;

  //   setChatStarted(true);
  //   setMessages([...messages, { text: input, type: "user" }]);
  //   setInput("");

  //   // Simulate bot response
  //   setTimeout(() => {
  //     setMessages((prev) => [
  //       ...prev,
  //       { text: "This is a response from Knowlio.", type: "bot" },
  //     ]);
  //   }, 1000);
  // };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setChatStarted(true);
    setMessages(prev => [...prev, { text: input, type: "user" }]); 
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ message: input }),
        mode: "cors"  // <-- Ensure CORS mode is enabled
    });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        setMessages(prev => [...prev, { text: data.response || "No response received.", type: "bot" }]);
    } catch (error) {
        console.error("Error:", error);
        setMessages(prev => [...prev, { text: "Error: Unable to get response.", type: "bot" }]);
    }
};

  return (
    <div className={knowlioStyles.container}>
      <header className={knowlioStyles.header}>
        <img src={knowlioLogo} alt="Knowlio Logo" className={knowlioStyles.logo} />
      </header>

      <main className={`${knowlioStyles.main} ${chatStarted ? knowlioStyles.shiftUp : ""}`}>
        {!chatStarted && <h1 className={knowlioStyles.title}>What can I help with?</h1>}
        
        <div className={knowlioStyles.messageConatiner}>
          {messages.map((msg, index) => (
            <div key={index} className={msg.type === "user" ? knowlioStyles.userMessage : knowlioStyles.botMessage}>
              {msg.text}
            </div>
          ))}
        </div>

        <div className={knowlioStyles.inputContainer}>
          <input
            type="text"
            className={knowlioStyles.inputBox}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          {/* <button className={knowlioStyles.sendButton} onClick={handleSend}>Send</button> */}
          <img src={sendButton} alt="Send button" className={knowlioStyles.sendButton} onClick={handleSend}/>
        </div>
      </main>
    </div>
  );
};

export default Knowlio;
