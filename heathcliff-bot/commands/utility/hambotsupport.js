const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("hambotsupport")
		.setDescription("gives links for HamBot support"),
	async execute(interaction) {
		try {
			await interaction.reply({ content: "ToS and Privacy Policy: https://github.com/sneuman999/heathcliff-bot/blob/104307fae98c852c671f8b8e27c1f5e02eb51fc2/ToS%20and%20Privacy%20Policy \nFor support questions, contact hambotdiscord@gmail.com.", ephemeral: true });
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	},
};