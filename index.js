const { Client, GatewayIntentBits, Collection } = require('discord.js');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.config = require('./config');
client.commands = new Collection()

require('./src/Structure/Handler/Event')(client);
require('./src/Structure/Handler/Command')(client);

client.login(client.config.clients.token);