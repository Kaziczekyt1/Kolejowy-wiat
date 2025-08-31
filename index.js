const { Client, GatewayIntentBits } = require("discord.js");
const Parser = require("rss-parser");
const fetch = require("node-fetch");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const token = process.env.TOKEN; // Twój token w Render
const parser = new Parser({
  customFields: {
    item: ["description", "content:encoded"]
  }
});

// LISTA RSS
const feeds = [
  { url: "https://twoj-feed-naprawy.pl/rss", channelId: "ID_KANAŁU_NAPRAWY" },
  { url: "https://twoj-feed-tory.pl/rss", channelId: "ID_KANAŁU_TORY" },
  { url: "https://twoj-feed-lokomotywy.pl/rss", channelId: "ID_KANAŁU_LOKOMOTYWY" }
];

// Funkcja pobierająca i wysyłająca wiadomości
async function checkFeeds() {
  for (const feed of feeds) {
    try {
      // pobranie z nagłówkiem
      const res = await fetch(feed.url, {
        headers: { "User-Agent": "Mozilla/5.0 (DiscordBot)" }
      });

      if (!res.ok) {
        console.error(`❌ Błąd pobierania RSS ${feed.url}: ${res.status}`);
        continue; // pomiń ten feed
      }

      const text = await res.text();

      let data;
      try {
        data = await parser.parseString(text);
      } catch (err) {
        console.error(`⚠️ Błąd parsowania RSS (${feed.url}):`, err.message);
        continue;
      }

      if (data.items?.length > 0) {
        const channel = client.channels.cache.get(feed.channelId);
        if (channel) {
          const latest = data.items[0];
          await channel.send(`📢 **Nowa informacja z RSS**\n${latest.title}\n${latest.link}`);
        }
      }
    } catch (err) {
      console.error(`❗ Problem z RSS (${feed.url}):`, err.message);
    }
  }
}

// Bot online
client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  // co 5 minut sprawdzaj feedy
  setInterval(checkFeeds, 5 * 60 * 1000);
});

client.login(process.env.TOKEN);
