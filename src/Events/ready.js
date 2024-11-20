const { ActivityType, Events, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: Events.ClientReady,
    execute(client) {
        console.log(`Connecté à ${client.user.username} !`);
        console.log(`-> Le bot est utilisé sur ${client.guilds.cache.size} serveurs !`);

        // Définir la présence du bot
        client.user.setPresence({
            activities: [{ name: client.config.clients.activity, type: ActivityType.Watching }],
            status: 'dnd',
        });

        // Enregistrer les commandes
        client.application.commands.set(client.commands.map(({ execute, ...data }) => data));

        // Vérification régulière des domaines
        setInterval(checkDomains, client.config.clients.time);

        let statusMessage; // Référence au dernier message envoyé
        async function checkDomains() {
            const embed = new EmbedBuilder()
                .setTitle("Statut des Infrastructures");

            for (const domain of client.config.clients.domains) {
                try {
                    const start = Date.now();
                    await axios.get(domain);
                    const ms = Date.now() - start;

                    embed.addFields({
                        name: domain,
                        value: `${client.config.clients.on} En ligne - Ping: ${ms}ms`,
                        inline: true,
                    });
                    embed.setColor("#24ff00");
                } catch (error) {
                    embed.addFields({
                        name: domain,
                        value: `${client.config.clients.off} Hors ligne`,
                        inline: true,
                    });
                    embed.setColor("#ff0000");
                    console.error(`Erreur pour ${domain} :`, error.message);
                }
            }

            const currentTime = Math.floor(Date.now() / 1000);
            const formattedDate = `<t:${currentTime}:R>`;
            embed.setDescription(`Prochaine actualisation ${formattedDate}`);
            embed.setTimestamp();

            // Vérification du footer
            if (client.config.clients.name && client.config.clients.logo) {
                embed.setFooter({ text: client.config.clients.name, iconURL: client.config.clients.logo });
            } else if (client.config.clients.name) {
                embed.setFooter({ text: client.config.clients.name });
            } else {
                console.warn("Nom ou logo manquant dans la configuration.");
            }

            // Envoi ou mise à jour du message
            const channel = client.channels.cache.get(client.config.clients.idchannel);
            if (channel) {
                if (statusMessage) {
                    statusMessage.edit({ embeds: [embed] });
                } else {
                    statusMessage = await channel.send({ embeds: [embed] });
                }
            } else {
                console.error(`Le canal avec l'ID ${client.config.clients.idchannel} est introuvable.`);
            }
        }
    }
};
