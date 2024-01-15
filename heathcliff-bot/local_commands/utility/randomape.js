const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("randomape")
		.setDescription("Ape Surprise!"),
	async execute(interaction) {
		try {
			var randomNum = Math.floor(Math.random() * 21) + 1;
			var date;
			switch (randomNum) {
				case 1:
					date = "2013/10/15";
					break;
				case 2:
					date = "2016/02/23";
					break;
				case 3:
					date = "2017/03/08";
					break;
				case 4:
					date = "2021/04/06";
					break;
				case 5:
					date = "2014/07/25";
					break;
				case 6:
					date = "2013/12/02";
					break;
				case 7:
					date = "2015/11/25";
					break;
				case 8:
					date = "2021/02/15";
					break;
				case 9:
					date = "2016/12/31";
					break;
				case 10:
					date = "2017/09/20";
					break;
				case 11:
					date = "2015/06/09";
					break;
				case 12:
					date = "2014/03/24";
					break;
				case 13:
					date = "2013/05/30";
					break;
				case 14:
					date = "2016/07/28";
					break;
				case 15:
					date = "2016/04/10";
					break;
				case 16:
					date = "2017/12/12";
					break;
				case 17:
					date = "2014/09/28";
					break;
				case 18:
					date = "2014/07/08";
					break;
				case 19:
					date = "2008/03/23";
					break;
				case 20:
					date = "2018/12/06";
					break;
				case 21:
					date = "2019/02/24";
					break;
				default:
					date = "2019/02/24";
					break;
			}
			var url = String('https://www.gocomics.com/heathcliff/' + date);
			await interaction.reply("Behold the Garbage Ape!\n" + url);
		}
		catch (err) {
			//await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	},
};