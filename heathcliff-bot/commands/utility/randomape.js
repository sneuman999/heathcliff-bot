const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("randomape")
		.setDescription("Ape Surprise!"),
	async execute(interaction) {
		
		fetch('https://heathcliff-api.winget.cloud/comic/original/list?searchText=Garbage%20Ape&includeTags=true')
  .then(res => res.json())
  .then(data => {
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomComic = data[randomIndex];
    const imageUrl = randomComic.imageUrl;
	const publishDate = randomComic.publishDate;

	interaction.deferReply();
	try {
		interaction.editReply({context: "Heathcliff comic from " + publishDate + ":\n" + imageUrl});
		console.log("I posted an Ape!");
	}
	catch (err) {
		//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
		console.log("I experienced a message error");
		return;
	}
    // You can use imageUrl in an <img> tag or wherever you need
  })
  .catch(err => console.error('Error fetching Garbage Ape comics:', err));

		return;
	},
};