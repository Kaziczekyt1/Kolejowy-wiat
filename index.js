require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

// Funkcja do wysyłania wiadomości
async function sendMessage(channelId, message) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel) {
      await channel.send(message);
      console.log(`📨 Wysłano do ${channelId}: ${message}`);
    }
  } catch (err) {
    console.error("Błąd przy wysyłaniu wiadomości:", err);
  }
}

// Automatyczne wiadomości (co 1h = 3600000 ms)
client.on("ready", () => {
  setInterval(() => {
    // przykładowe wiadomości dla kanałów
    sendMessage("1404221151433064498", "🚆 Tory kolejowe przechodzą dzisiaj konserwację w kilku regionach.");
    sendMessage("1404221189198446784", "🔧 Aktualizacja: Prowadzone są prace naprawcze na linii Warszawa – Gdańsk.");
    sendMessage("1404220512712003644", "📰 Nowość: PKP Intercity zapowiedziało nowe wagony sypialne.");
    sendMessage("1404221112736284732", "🚂 Dzisiejsza ciekawostka: EU07 to jedna z najpopularniejszych lokomotyw w Polsce.");
  }, 3600000); // co 1h
});

client.login(process.env.DISCORD_TOKEN);