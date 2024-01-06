import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import send from "./assets/send.svg";

const App = () => {
  const [formValue, setFormValue] = useState("");
  const [messages, setMessages] = useState([]);

  // Typing text effect
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messageText.length) {
        setMessageText((prevText) => prevText + messageText[index]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  }, [messageText]);

  // Loader functionality
  const str = "StellarBot is typing.";
  const [loaderText, setLoaderText] = useState(str);

  useEffect(() => {
    let interval = setInterval(() => {
      setLoaderText((prevText) => prevText + ".");

      if (loaderText.length >= 3) {
        setLoaderText(str);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [loaderText]);

  // Text area gets focus
  const textareaRef = useRef(null);
  function focusTextarea() {
    textareaRef.current.focus();
  }
  useEffect(() => {
    focusTextarea();
  });

  // Make a GET request to the server
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear the form
    setFormValue("");

    // Add a new message to the messages state with processing set to true
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: formValue, processing: true },
    ]);

    // Make a POST request to the server
    const response = await fetch("http://localhost:5000", {
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

      // Update the last message in the messages state
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages];
        const lastIndex = newMessages.length - 1;
        newMessages[lastIndex].processing = false;
        newMessages[lastIndex].text = parsedData;
        return newMessages;
      });
    } else {
      // Handle the server's error
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
              <div className="message">
                {message.processing ? loaderText : message.text}
              </div>
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
          ref={textareaRef}
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
