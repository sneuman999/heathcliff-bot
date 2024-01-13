const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("removedaily")
		.setDescription("this channel will no longer receive the daily Heathcliff comic every morning at 9am CST"),
	async execute(interaction) {
		const fs = require('fs');
		const channelId = interaction.channelId;
		const channelName = interaction.channel.name;

		try {
			await interaction.reply(channelName + " will no longer receive the daily Heathcliff comic.");
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}

		var data = fs.readFileSync('channels.txt', 'utf-8');

		var newValue = data.replace(channelId + "\r\n", '');
		fs.writeFileSync('channels.txt', newValue, 'utf-8');
	},
};