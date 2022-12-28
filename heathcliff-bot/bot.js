// Run dotenv
require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

		
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
	const channel = client.channels.cache.get('549738642713870349');
	//1049795501400264765 
	//console.log(channel.id);
});

var CronJob = require('cron').CronJob;
var job = new CronJob(
	'00 00 09 * * *',
	function() {
		const channel = client.channels.cache.get('549738642713870349');
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
			
		randomDate = yyyy + '/' + mm + '/' + dd;
		var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			
		channel.send(url);
	},
	null,
	true,
	'America/Chicago'
);

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.content === '!dailyHeathcliff') {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = yyyy + '/' + mm + '/' + dd;
	
		var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
	
		message.channel.send(url);
		return;
	}
	if (message.content ==='!randomHeathcliff')
	{
		var today = new Date();
		var randomDate = new Date();
		var dd = String(Math.floor(Math.random() * 28) + 1);
		var mm = String(Math.floor(Math.random() * 12) + 1);
		var yyyy = String(Math.floor(Math.random() * 14) + 2009);
			
		randomDate = yyyy + '/' + mm + '/' + dd;
		var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			
		message.channel.send(url);
		return;
	}
	if (message.content ==='!config')
	{

		await client.guilds.cache.fetch();
		let serverCount = client.guilds.cache.size;
		message.channel.send(serverCount);
		
	}
	if (message.content.includes("ape") || message.content.includes("monke"))
	{
		message.channel.send("Behold the Garbage Ape!");
		var randomNum = Math.floor(Math.random()*21)+1;
		var date;
		switch(randomNum){
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
		message.channel.send(url);
		return;
	}

	
})

client.login(process.env.DISCORD_TOKEN);