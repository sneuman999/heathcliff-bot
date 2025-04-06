const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("randomheathcliff")
		.setDescription("posts a random Heathcliff comic from the vault."),
	async execute(interaction) {
		var randomDate = new Date();
		var dd = String(Math.floor(Math.random() * 28) + 1);
		var mm = String(Math.floor(Math.random() * 12) + 1);
		var yyyy = String(Math.floor(Math.random() * 14) + 2009);

		randomDate = yyyy + '-' + mm + '-' + dd;

		var url = String('https://heathcliff-images.storage.gogoleapis.com/heathcliff//' + randomDate + '.png');

		try {
			await interaction.reply(url);
			console.log("I posted a random Heathcliff");
		}
		catch (err) {
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
	},
};