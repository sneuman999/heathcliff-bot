const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dailyheathcliff")
		.setDescription("posts Heathcliff comic for today's date"),
	async execute(interaction) {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = yyyy + '-' + mm + '-' + dd;

		var url = String('https://heathcliff-images.storage.gogoleapis.com/heathcliff//' + today + '.png');

		try {
			await interaction.reply(url);
			console.log("I posted the Daily Heathcliff");
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	},
};