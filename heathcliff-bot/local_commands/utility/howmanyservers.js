const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("howmanyservers")
		.setDescription("returns the number of servers HamBot is in."),
	async execute(interaction) {
		await message.channel.send("I'm in " + client.guilds.cache.size + " servers!");
	},
};