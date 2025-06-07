const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("dailyheathcliff")
		.setDescription("posts Heathcliff comic for today's date"),
	async execute(interaction) {

		const currentdate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
		var apiURL = String("https://storage.googleapis.com/heathcliff-comics/" + currentdate +".png");
		interaction.reply("Heathcliff comic for today:\n" + apiURL);

		// fetch(apiURL)
		// .then(response => {
		//   if (!response.ok) {
		// 	throw new Error(`HTTP error! status: ${response.status}`);
		//   }
		//   return response.json(); 
		// })
		// .then(data => {
		//   //console.log(data); // Process the data

		//   try {
		// 	interaction.reply("Heathcliff comic from " + data.publishDate + ":\n" + data.imageUrl);
		// 	console.log("I posted the Daily Heathcliff");
		// }
		// catch (err) {
		// 	//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
		// 	console.log("I experienced a message error");
		// 	return;
		// }
		  
		// })
		// .catch(error => {
		//   console.error("Fetching error:", error);
		// });

		return;
	},
};