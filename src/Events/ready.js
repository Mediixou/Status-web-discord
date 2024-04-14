const { ActivityType, Events, EmbedBuilder } = require('discord.js');
const axios = require('axios')

module.exports = {
    name: Events.ClientReady,
    execute(client) {
        console.log('\x1b[33m' + `Connectés à ${client.user.username} !\n` + '\x1b[33m' + `-> Le bot est utilisé sur ${client.guilds.cache.size} serveurs !`);

        client.user.setPresence({
            activities: [{ name: client.config.clients.activity, type: ActivityType.Watching }],
            status: 'dnd',
        });

        client.application.commands.set(client.commands.map(({ execute, ...data }) => data))


        setInterval(checkDomains, client.config.clients.time); 


        let statusMessage;
        async function checkDomains() {
          const embed = new EmbedBuilder()
            .setTitle("Statut des Infrastruture")
        
          for (const domain of client.config.clients.domains) {
            try {
              const start = Date.now();
              const response = await axios.get(domain);
              const ms = Date.now() - start;
        
              embed.addFields({
                name: domain,
                value: `${client.config.clients.on} En ligne - Ping: ${ms}ms`,
                inline: true,
              });
              embed.setColor(`#24ff00`)
            } catch (error) {
              embed.addFields({
                name: domain,
                value: `${client.config.clients.off} Hors ligne`,
                inline: true,
              });
              embed.setColor(`#ff0000`)
              console.log(error);
            }
                        const currentTime = Math.floor(Date.now() / 1000);
            const targetTime = currentTime - 0;
            
            const formattedDate = `<t:${targetTime}:R>`;
            
            embed.setDescription(`Prochaine actualisation dans ${formattedDate}`);
            embed.setTimestamp();
            embed.setFooter({ text: client.config.clients.name, iconURL: client.config.clients.logo});

          }
        
          const channel = client.channels.cache.get(client.config.clients.idchannel); 
          if (channel) {
            if (statusMessage) {
              statusMessage.edit({ embeds: [embed] });
            } else {
              statusMessage = await channel.send({ embeds: [embed] });
            }
          }
        }
    }
}