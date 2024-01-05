import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import send from "./assets/send.svg";

const App = () => {
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);

  //// loading while fetching data
  const str = "StellarBot is typing";
  const [loadingText, setLoadingText] = useState("");

  useEffect(() => {
    let loadInterval = null;

    const loader = () => {
      loadInterval = setInterval(() => {
        setLoadingText((prevText) => {
          const newText = prevText;
          if (newText === "" || newText.length > str.length + 3) {
            return str;
          } else {
            return newText + ".";
          }
        });
      }, 500);
    };

    loader();

    return () => {
      clearInterval(loadInterval);
    };
  }, []);

  //// unique id for each message
  const generateUniqueId = () => {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-${hexadecimalString}`;
  };

  //// stripes for chat messages
  const chatStripe = (isAi, value, uniqueId) => {
    const imgSrc = isAi ? bot : user;
    const altText = isAi ? "bot" : "user";
    const wrapperClass = isAi ? "wrapper ai" : "wrapper";

    return (
      <div className={wrapperClass}>
        <div className="chat">
          <div className="profile">
            <img src={imgSrc} alt={altText} />
          </div>
          <div className="message" id={uniqueId}>
            {value}
          </div>
        </div>
      </div>
    );
  };

  //// handleSubmit function
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear the form
    setFormValue("");

    // Add a new message to the messages state
    setMessages([...messages, { sender: "user", text: formValue }]);

    // Make a POST request to the server
    const response = await fetch("https://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: formValue,
      }),
    });

    // Handle the server's response
    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();

      // Add the server's response to the messages state
      setMessages([...messages, { sender: "bot", text: parsedData }]);
    } else {
      const err = await response.text();
      alert(err);
    }
  };

  return (
    <div id="app">
      <div id="chat_container">
        {messages.map((message, i) => (
          <div
            className={`wrapper ${message.sender === "bot" && "ai"}`}
            key={i}
          >
            <div className="chat">
              <div className="profile">
                <img
                  src={message.sender === "bot" ? bot : user}
                  alt={message.sender}
                />
              </div>
              <div className="message">{message.text}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Message StellarBot..."
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type="submit">
          <img src={send} alt="send" />
        </button>
      </form>
    </div>
  );
};

export default App;
