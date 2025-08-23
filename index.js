// === Importy ===
const { Client, GatewayIntentBits } = require("discord.js");
const Parser = require("rss-parser");
const express = require("express");

// === Konfiguracja ===
const token = "MTQwNTc3MDgwNTUzMDU5MTIzMg"; // ← tutaj wklej token swojego bota
const channelIds = {
  tory: "1404221151433064498",
  naprawy: "1404221189198446784",
  nowosci: "1404220512712003644",
  pociagi: "1404221112736284732",
};

// Źródła RSS – można dodać więcej
const feeds = {
  nowosci: "https://www.rynek-kolejowy.pl",
  naprawy: "https://utk.gov.pl/pl",
  tory: "https://www.plk-sa.pl/o-spolce/biuro-prasowe/aktualnosci",
  lokomotywy: "https://kurier-kolejowy.pl/transport-intermodalny"
};

// === Discord client ===
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const parser = new Parser();
let postedLinks = new Set(); // pamięta wysłane linki

// === Funkcja pobierania wiadomości ===
async function fetchAndPost() {
  for (let [key, url] of Object.entries(feeds)) {
    try {
      let feed = await parser.parseURL(url);
      let channel = client.channels.cache.get(channelIds[key]);

      if (!channel) continue;

      for (let item of feed.items.slice(0, 3)) { // tylko 3 najnowsze
        if (postedLinks.has(item.link)) continue;
        if (!item.link || item.link.includes("404")) continue;

        const msg = `📰 **${item.title}**\n${item.link}`;
        await channel.send(msg);
        postedLinks.add(item.link);
      }
    } catch (err) {
      console.error(`Błąd RSS (${key}):`, err.message);
    }
  }
}

// === Uruchamianie co 10 minut ===
setInterval(fetchAndPost, 10 * 60 * 1000);

// === Start klienta ===
client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  fetchAndPost(); // startowe pobranie
});

client.login(process.env.TOKEN);

// === Express (port dla Render) ===
const app = express();
app.get("/", (req, res) => res.send("✅ Bot działa!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Serwer nasłuchuje na porcie ${PORT}`));
