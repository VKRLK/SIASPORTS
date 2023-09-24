const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();

const PORT = process.env.port || 3000;
const website = "https://diapazon.kz/category/sport/aktobe";

try {
  axios(website).then((res) => {
    const data = res.data;
    const $ = cheerio.load(data);
    let content = [];

    $(".news-cart", data).each(function () {
      const textArray = $(this)
        .text()
        .replace(/\n/g, "")
        .trim()
        .split("                        ");
      const title = textArray[0];
      const date = textArray[1].trim();
      const url = "https://diapazon.kz" + $(this).find("a").attr("href");

      content.push({
        title,
        url,
        date,
      });

      app.get("/", (req, res) => {
        res.json(content);
      });
    });
    console.log(content);
  });
} catch (error) {
  console.log(error, error.message);
}
