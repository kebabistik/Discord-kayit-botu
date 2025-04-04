const { Client, GatewayIntentBits, Partials, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// Komutları saklayacağımız bir koleksiyon
client.commands = new Collection();

// Komut dosyalarını yükle
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

// Interaction Event'i
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId === "Kebabsavar31 Kayıt") {
        const kayıtRolü = "1307776324542398633"; // Kayıt olunacak rol ID'si
        const misafirRolü = "1357663948174004236"; // Misafir rolü ID'si

        if (!interaction.member.roles.cache.has(kayıtRolü)) {
            try {
                await interaction.member.roles.remove(misafirRolü);
                await interaction.member.roles.add(kayıtRolü);

                await interaction.reply({
                    content: "Başarılı şekilde sunucuya kayıt oldunuz, iyi eğlenceler.",
                    ephemeral: true,
                });
            } catch (error) {
                console.error("Rol değiştirme sırasında hata oluştu:", error);
                await interaction.reply({
                    content: "Bir hata oluştu, lütfen yetkililere ulaşınız.",
                    ephemeral: true,
                });
            }
        } else {
            await interaction.reply({
                content: "Sunucu kaydınız zaten yapılmış. Bir sorun ile karşılaştıysanız yetkililere ulaşınız.",
                ephemeral: true,
            });
        }
    }
});

// Komutlar için Message Event'i
client.on("messageCreate", async (message) => {
    if (message.author.bot || !message.content.startsWith("!")) return;

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);

    if (!command) return;

    try {
        await command.calistir(client, message, args);
    } catch (error) {
        console.error("Komut çalıştırılırken hata oluştu:", error);
        message.reply("Bu komut çalıştırılırken bir hata oluştu.");
    }
});

// Bot hazır olduğunda
client.once("ready", () => {
    console.log(`${client.user.tag} ile giriş yapıldı!`);
});

// Botu başlat
client.login(" token gir   "); // Buraya kendi bot tokeninizi ekleyin.