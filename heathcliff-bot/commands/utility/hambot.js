const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("hambot")
		.setDescription("lists and explains HamBot's commands"),
	async execute(interaction) {
		try {
			await interaction.reply({ content: '/dailyHeathcliff: posts Heathcliff comic for todays date.\n/randomHeathcliff: posts a random Heathcliff comic from the vault.\n/addDaily: this channel will receive the daily Heathcliff comic every morning at your chosen time.\n/removeDaily: this channel will no longer receive the daily Heathcliff comic.\n/hambotSupport: gives links for HamBot support.', ephemeral: true });
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	},
};