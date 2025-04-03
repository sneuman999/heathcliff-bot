const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dailyheathcliff")
		.setDescription("posts Heathclilff comic for today's date"),
	async execute(interaction) {
		//var today = new Date();
		//var dd = String(today.getDate()).padStart(2, '0');
		//var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		//var yyyy = today.getFullYear();

		//today = yyyy + '/' + mm + '/' + dd;
// GOCOMICS Broke Heathcliff bot, this should fix daily heathcliffs for the moment, until I work out how the silly little creators thing looks up the right comic.
		var url = String('https://www.creators.com/read/heathcliff);

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
