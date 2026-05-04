const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("fetchheathcliff")
		.setDescription("posts Heathcliff comic for a specific date")
		.addIntegerOption(option =>
			option.setName('month')
				.setMinValue(1)
				.setMaxValue(12)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('day')
				.setMinValue(1)
				.setMaxValue(31)
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('year')
				.setMinValue(2003)
				.setMaxValue(2026)
                .setRequired(true))
	,
	async execute(interaction) {

		await interaction.deferReply();
		const month = interaction.options.getInteger('month');
		const day = interaction.options.getInteger('day');
		const year = interaction.options.getInteger('year');
        const enteredDate = String(year) + '-' + String(month).padStart(2, '0') + '-' + String(day).padStart(2, '0');
		var apiURL = String("https://storage.googleapis.com/heathcliff-comics/" + enteredDate +".png");
		try {
			interaction.editReply({content: "Heathcliff comic for " + enteredDate + ":\n" + apiURL});
			console.log("I posted the Daily Heathcliff");
		}
		catch (err) {
			console.log("I experienced a message error");
			return;
		}
		return;
	},
};