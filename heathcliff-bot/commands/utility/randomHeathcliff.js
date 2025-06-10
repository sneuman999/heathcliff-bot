const { SlashCommandBuilder } = require('discord.js');
const { Storage } = require('@google-cloud/storage');
const { servicekey } = require('./config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("randomheathcliff")
		.setDescription("posts a random Heathcliff comic from the vault."),
		async execute(interaction) {

			await interaction.deferReply();
			  const storage = new Storage({
				keyFilename: servicekey,
  			});	
			const bucketName = 'heathcliff-comics';		
			const bucket = storage.bucket(bucketName);

			const [files] = await bucket.getFiles();
			const randomIndex = Math.floor(Math.random() * files.length);
			const randomFile = files[randomIndex].name;
			const fileDate = randomFile.slice(0, -4);
			var url = `https://storage.googleapis.com/${bucketName}/${randomFile}`;
			
			try {
				interaction.editReply({content : "Heathcliff comic from " + fileDate + ":\n" + url});
				console.log("I posted a Random Heathcliff");
			}
			catch (err) {
				console.log("I experienced a message error");
				return;
			}

			return;
		},
	};