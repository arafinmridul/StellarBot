import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import send from "./assets/send.svg";

const App = () => {
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);

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

  return (
    <div id="app">
      <div ref={chatContainerRef} id="chat_container">
        <div style={{ color: "white" }}>
          {loadingText} {/*this div for test*/}
        </div>
      </div>
      <form ref={formRef}>
        <textarea
          name="prompt"
          rows="1"
          cols="1"
          placeholder="Message StellarBot..."
        ></textarea>
        <button type="submit">
          <img src={send} alt="send" />
        </button>
      </form>
    </div>
  );
};

export default App;
