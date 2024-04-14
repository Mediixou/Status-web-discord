const { EmbedBuilder } = require('discord.js');

class command {
    constructor() {
        this.name = "ping",
        this.description = "Permets de voir le ping du bot."
    }

    async execute(client, interaction) {
        const PING = new EmbedBuilder()
            .setColor(client.config.clients.embedColor)
            .setTitle('**Ping**')
            .setDescription("🏓 Pong")
            .addFields(
                { name: '🔧 - Latence :', value: `${Date.now() - interaction.createdTimestamp}ms.` },
            )
            .setTimestamp()
            .setFooter({ text: client.config.clients.name, iconURL: client.config.clients.logo});

        interaction.reply({ embeds: [PING] });
    }
}

module.exports = command