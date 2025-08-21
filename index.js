// --- PORT BINDING (dla Render) ---
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("✅ Bot działa 24/7!"));
app.listen(PORT, () => console.log(`🌐 Serwer HTTP uruchomiony na porcie ${PORT}`));

// --- BOT DISCORDA ---
const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.login(process.env.TOKEN);

// Mapa: kanał -> treść wiadomości
const CHANNEL_MESSAGES = {
  "1404221189198446784": "🚧 Aktualizacja: prowadzone są prace konserwacyjne na sieci kolejowej.",
  "1404220512712003644": "📰 Nowości: pojawiły się świeże informacje ze świata kolei.",
  "1404221112736284732": "🚂 Ciekawostka: lokomotywy odgrywają kluczową rolę w transporcie towarowym i pasażerskim.",
  "1404221151433064498": "🚆 Informacja: nowe połączenia pociągów regionalnych zostały uruchomione."
};

client.once("ready", () => {
  console.log(`✅ Bot jest online jako ${client.user.tag}`);

  // Od razu po starcie wyśle wiadomość na każdy kanał
  for (const [channelId, message] of Object.entries(CHANNEL_MESSAGES)) {
    const channel = client.channels.cache.get(channelId);
    if (channel) {
      channel.send("🤖 Bot wystartował i będzie publikował wiadomości co 10 minut!");
    }
  }

  // Co 10 minut wysyła przypisane wiadomości na kanały
  setInterval(() => {
    for (const [channelId, message] of Object.entries(CHANNEL_MESSAGES)) {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        channel.send(message);
      }
    }
  }, 10 * 60 * 1000);
});

client.login(TOKEN);