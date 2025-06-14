const { SlashCommandBuilder } = require('discord.js');
const { PermissionFlagsBits } = require('discord-api-types/v10');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("removedaily")
		.setDescription("this channel will no longer receive the daily Heathcliff comic")
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
		.setDMPermission(false)
	,
	async execute(interaction) {
		await interaction.deferReply();

		const fs = require('fs');
		const channelId = interaction.channelId;
		const channelName = interaction.channel.name;

		try {
			await interaction.editReply(channelName + " will no longer receive the daily Heathcliff comic.");
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}

		var data = fs.readFileSync('channels.txt', 'utf-8');
		var dataSplit = data.split('\r\n');
		console.log(dataSplit);
		const filteredArray = dataSplit.filter(item => !item.includes(channelId));
		var newValue = filteredArray.join('\r\n');
		fs.writeFileSync('channels.txt', newValue, 'utf-8');
	},
};