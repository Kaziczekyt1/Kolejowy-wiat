require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const express = require("express");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

// === Serwer Express, żeby Render widział PORT ===
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => res.send("Bot działa!"));
app.listen(PORT, () => console.log(`Serwer nasłuchuje na porcie ${PORT}`));

// === Po zalogowaniu ===
client.once("ready", () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  setInterval(() => {
    // TORy I SIECI
    const channelTory = client.channels.cache.get("1404221151433064498");
    if (channelTory) {
      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🚧 Tory i sieci trakcyjne")
        .setDescription(
          "Aktualizacja prac torowych i modernizacji sieci trakcyjnej. Sprawdź więcej informacji poniżej."
        )
        .setURL("https://www.plk-sa.pl/aktualnosci")
        .setFooter({ text: "Źródło: PKP PLK" });
      channelTory.send({ embeds: [embed] });
    }

    // NAPRAWY I KONSERWACJE
    const channelNaprawy = client.channels.cache.get("1404221189198446784");
    if (channelNaprawy) {
      const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("🔧 Naprawy i konserwacje")
        .setDescription(
          "Planowane i bieżące prace konserwacyjne na liniach kolejowych. Zobacz szczegóły."
        )
        .setURL("https://portalpasazera.pl")
        .setFooter({ text: "Źródło: Portal Pasażera" });
      channelNaprawy.send({ embeds: [embed] });
    }
    // NOWOŚCI KOLEJOWE
    const channelNowosci = client.channels.cache.get("1404220512712003644");
    if (channelNowosci) {
      const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("📰 Nowości kolejowe")
        .setDescription(
          "Najnowsze wydarzenia ze świata kolei – inwestycje, przetargi i ciekawostki."
        )
        .setURL("https://www.rynek-kolejowy.pl")
        .setFooter({ text: "Źródło: Rynek Kolejowy" });
      channelNowosci.send({ embeds: [embed] });
    }

    // LOKOMOTYWY I POCIĄGI
    const channelLokomotywy = client.channels.cache.get("1404221112736284732");
    if (channelLokomotywy) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🚂 Lokomotywy i pociągi")
        .setDescription(
          "Nowinki o lokomotywach i składach pasażerskich. Kliknij poniżej, by dowiedzieć się więcej."
        )
        .setURL("https://kurierkolejowy.eu")
        .setFooter({ text: "Źródło: Kurier Kolejowy" });
      channelLokomotywy.send({ embeds: [embed] });
    }
  }, 10 * 60 * 1000); // co 10 minut
});

// === TOKEN z pliku .env ===
client.login(process.env.TOKEN);