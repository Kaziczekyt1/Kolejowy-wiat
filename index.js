const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const express = require("express");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// 🔹 PROSTY SERWER EXPRESS dla Render
const app = express();
app.get("/", (req, res) => res.send("✅ Bot działa!"));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Serwer wystartował na porcie ${PORT}`));

client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: "Kolejowy Świat 🚂", type: 0 }],
    status: "online"
  });
});

// INTERWAŁ – co 10 minut różne wiadomości
setInterval(() => {
  // TORY I SIECI
  const channelTory = client.channels.cache.get("1404221151433064498");
  if (channelTory) {
    channelTory.send(
      "🚧 Aktualizacja torów i sieci trakcyjnej!\nSprawdź szczegóły tutaj: https://www.plk-sa.pl/dla-podroznych"
    );
  }

  // NAPRAWY I KONSERWACJE
  const channelNaprawy = client.channels.cache.get("1404221189198446784");
  if (channelNaprawy) {
    channelNaprawy.send(
      "🔧 Planowane naprawy i konserwacje – bieżący harmonogram: https://www.plk-sa.pl/utrzymanie"
    );
  }

  // NOWOŚCI KOLEJOWE
  const channelNowosci = client.channels.cache.get("1404220512712003644");
  if (channelNowosci) {
    channelNowosci.send(
      "📰 Nowości kolejowe! Zobacz najświeższe informacje: https://kurierkolejowy.eu"
    );
  }

  // LOKOMOTYWY I POCIĄGI
  const channelLokomotywy = client.channels.cache.get("1404221112736284732");
  if (channelLokomotywy) {
    channelLokomotywy.send(
      "🚂 Ciekawostki o lokomotywach i pociągach!\nZdjęcia i artykuły: https://kolejnapolska.pl"
    );
  }
}, 10 * 60 * 1000); // co 10 minut

// PROSTA KOMENDA
client.on("messageCreate", (message) => {
  if (message.content === "!ping") {
    message.reply("Pong! 🚂");
  }
});

client.login(process.env.TOKEN);