import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

import errResponse from "./errResponse.js";

dotenv.config(); // loads .env file

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
app.use(cors()); // allows cross-origin requests
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "StellarBot is online!",
  });
});

app.post("/", async (req, res) => {
  // res.status(500).send({ bot: errResponse[0].bot });
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 500,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200).send({ bot: response.data.choices[0].text });
  } catch (error) {
    console.log(error); // logging the issue
    // still simulating an ok response from the bot
    res.status(200).send({ bot: errResponse[0].bot });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send({ bot: errResponse[0].bot });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
