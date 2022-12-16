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
	//const channel = client.channels.cache.get('1049795501400264765');
	//549738642713870349
	//1049795501400264765 
	//console.log(channel);
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

		const channel = client.guilds.cache.get('id');
		console.log(channel.guildId);
		await client.guilds.cache.fetch();
		message.channel.send(client.guilds.cache.size);
		
		//const channel = client.channels.cache.get('1049795501400264765');
		//var today = new Date();
		//var dd = String(today.getDate()).padStart(2, '0');
		//var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		//var yyyy = today.getFullYear();
			
		//randomDate = yyyy + '/' + mm + '/' + dd;
		//var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			
		//channel.send(url);
		
	}
})

client.login(process.env.DISCORD_TOKEN);