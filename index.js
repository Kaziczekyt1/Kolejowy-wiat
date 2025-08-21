// index.js
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const Parser = require("rss-parser");
const fetch = require("node-fetch");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot działa! 🚂"));
app.listen(PORT, () => console.log(`🌍 Port nasłuchuje na ${PORT}`));

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const parser = new Parser();

// 🔑 TOKEN bota z Discorda
const token = process.env.BOT_TOKEN;

// 🔹 ID kanałów Discorda (zmień na swoje!)
const channels = {
  tory: "1404221151433064498",
  naprawy: "1404221189198446784",
  nowosci: "1404220512712003644",
  pociagi: "1404221112736284732",
};

// 🔹 Źródła RSS
const feeds = [
  "https://www.rynek-kolejowy.pl/rss", 
  "https://kurierkolejowy.eu/rss"
];

// 🔹 Pamięć wysłanych linków
let seen = new Set();

// ✅ Funkcja sprawdzająca, czy link działa
async function isValidLink(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch (err) {
    return false;
  }
}

// ✅ Pobieranie i wysyłanie newsów
async function fetchNews() {
  for (let feed of feeds) {
    try {
      let data = await parser.parseURL(feed);

      for (let item of data.items.slice(0, 3)) {
        if (seen.has(item.link)) continue;
        seen.add(item.link);

        if (!(await isValidLink(item.link))) {
          console.log(`❌ Niedziałający link: ${item.link}`);
          continue;
        }

        // Szukanie obrazka w RSS
        let imageUrl = null;
        if (item.enclosure && item.enclosure.url) {
          imageUrl = item.enclosure.url;
        } else if (item.content && item.content.match(/<img[^>]+src="([^">]+)"/)) {
          imageUrl = item.content.match(/<img[^>]+src="([^">]+)"/)[1];
        }

        // Tworzymy embed
        const embed = new EmbedBuilder()
          .setTitle(item.title)
          .setDescription(item.contentSnippet || "Brak opisu")
          .setURL(item.link)
          .setColor("#2E86C1")
          .setFooter({ text: "🚆 Kolejowy Świat - Nowości" });

        if (imageUrl) embed.setImage(imageUrl);

        // Wysyłamy do wszystkich kanałów
        for (let ch of Object.values(channels)) {
          const channel = await client.channels.fetch(ch);
          if (channel) await channel.send({ embeds: [embed] });
        }
      }
    } catch (err) {
      console.error(`⚠️ Błąd RSS: ${feed}`, err.message);
    }
  }
}

// 🔹 Uruchamiamy bota
client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  fetchNews();
  setInterval(fetchNews, 10 * 60 * 1000); // co 10 minut
});

client.login(token);
