const { OpenAI } = require("openai");
const express = require("express");
const fs = require("fs");

const openai = new OpenAI({
  apiKey: "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",
});

const app = express();
app.use(express.json());

const port = process.env.PORT || 5000;

async function generateImage(prompt) {
  return await openai.images
    .generate({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    })
    .then((res) => {
      console.log(res.data[0].url);
    });
}

async function generateImageFromPicture(prompt) {
  return await openai.images
    .edit({
      image: fs.createReadStream("./assets/background.png"),
      mask: fs.createReadStream("./assets/mask.png"),
      prompt: prompt,
    })
    .then((res) => {
      console.log(res.data[0].url);
    });
}

const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(
  "Choose picture generating method (1 or 2): \n1) from text only\n2) from picture and text \n",
  (method) => {
    switch (method) {
      case "1": {
        readline.question("Enter your prompt:  ", (prompt) => {
          generateImage(prompt);
          readline.close();
        });
        break;
      }
      case "2": {
        readline.question("Enter your prompt:  ", (prompt) => {
          generateImageFromPicture(prompt);
          readline.close();
        });
        break;
      }
    }
  }
);
