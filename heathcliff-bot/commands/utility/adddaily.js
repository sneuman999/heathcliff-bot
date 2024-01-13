const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("adddaily")
		.setDescription("this channel will receive the daily Heathcliff comic every morning at 9am CST"),
	async execute(interaction) {
		const channelId = interaction.channelId;
		const channelName = interaction.channel.name;

		const fs = require('fs');
		fs.readFile('channels.txt', 'utf8', function (err, data) {
			if (!(data.includes(channelId))) {
				try {
					interaction.reply(channelName + " will now receive the daily Heathcliff comic at 9am CST every day!");
					fs.appendFile('channels.txt', channelId + "\r\n", function (err) {
						if (err) throw err;
					});
				}
				catch (err) {
					//interaction.author.send("I don't have permission to post in " + channelName + ". Ask your Server Admin for help");
					console.log("I experienced a message error");
					return;
				}
			}
			else {
				try {
					interaction.reply(channelName + " is already receiving the daily Heathcliff comic at 9am CST every day!");
				}
				catch (err) {
					//interaction.author.send("I don't have permission to post in " + channelName + ". Ask your Server Admin for help");
					console.log("I experienced a message error");
					return;
				}
			}
		});
	},
};
