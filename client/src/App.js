import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";
import send from "./assets/send.svg";

const App = () => {
  const chatContainerRef = useRef(null);
  const formRef = useRef(null);

  return (
    <div id="app">
      <div ref={chatContainerRef} id="chat_container"></div>
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
