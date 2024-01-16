const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("adddaily")
		.setDescription("this channel will receive the daily Heathcliff comic every day at your chosen time")
		.addIntegerOption(option =>
			option.setName('hour')
				.setDescription('hour daily comic will be posted every day in *Central Standard Time*. Input in 0-23 format.')
				.setMinValue(0)
				.setMaxValue(23)
				.setRequired(true))
	,

	async execute(interaction) {
		const channelId = interaction.channelId;
		const channelName = interaction.channel.name;
		const hour = interaction.options.getInteger('hour');
		let hourString = hour.toString();

		if (hourString.length == 1) {
			hourString = '0' + hourString;
		}

		const fs = require('fs');
		fs.readFile('channels.txt', 'utf8', function (err, data) {
			if (!(data.includes(channelId))) {
				try {
					interaction.reply(channelName + " will now receive the daily Heathcliff comic at " + hourString +  ":00 CST every day!");
					fs.appendFile('channels.txt', channelId + ", " + hourString + "\r\n", function (err) {
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
					interaction.reply(channelName + " is already receiving the daily Heathcliff comic!");
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
