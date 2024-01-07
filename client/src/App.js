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
    const intervalId = setInterval(() => {
      setLoaderText((prevText) => {
        // If the loaderText has 4 dots, reset it to the original value
        if (prevText.endsWith("....")) {
          return str;
        }
        // Otherwise, add a dot to the end
        return prevText + ".";
      });
    }, 300);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []);

  // Text area gets focus
  const textareaRef = useRef(null);
  function focusTextarea() {
    textareaRef.current.focus();
  }
  useEffect(() => {
    focusTextarea();
  });

  // Enter key functionality
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && formValue.trim() !== "") {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // After submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adding user's message to the messages state
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "user", text: formValue, processing: false },
    ]);

    // Clear the form
    setFormValue("");

    // Adding the bot's message to the messages state
    // When setState is called, React schedules an update to the component’s state immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: "bot", text: "", processing: true },
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

      // Updating bot's message in the messages state
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

  // Scroll to the bottom of the chat box
  const chatBoxRef = useRef(null);
  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [messages]);

  return (
    <div id="app">
      <div id="chat_container" ref={chatBoxRef}>
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
          onKeyDown={handleKeyDown}
        />
        <button type="submit">
          <img src={send} alt="send" />
        </button>
      </form>
    </div>
  );
};

export default App;
