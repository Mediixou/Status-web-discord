const { Events } = require("discord.js")

module.exports = {
    name: Events.InteractionCreate,
    execute(interaction, client) {
        if(interaction.channel === null) return
        if(!interaction.isCommand()) return
        if(!client.commands.has(interaction.commandName)) return
        try {
            client.commands.get(interaction.commandName).execute(client, interaction)
        } catch (error) {
            console.error(error)
        }
    }
}