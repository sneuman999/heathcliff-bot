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
	//const channel = client.channels.cache.get('549738642713870349');
	//1049795501400264765 
	//console.log(channel.id);
});

var CronJob = require('cron').CronJob;
var job = new CronJob(
	'00 00 09 * * *',
	function() {
		
		const fs = require('fs');
		const readline = require('readline');
		
		// Creating a readable stream from file
		// readline module reads line by line 
		// but from a readable stream only.
		const file = readline.createInterface({
			input: fs.createReadStream('channels.txt'),
			output: process.stdout,
			terminal: false
		});
  
		// Printing the content of file line by
		//  line to console by listening on the
		// line event which will triggered
		// whenever a new line is read from
		// the stream
		file.on('line', (line) => {

			const channel = client.channels.cache.get(line);
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();
			
			randomDate = yyyy + '/' + mm + '/' + dd;
			var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			
			try { channel.send(url) } catch (err) {}
		});
		
		

	},
	null,
	true,
	'America/Chicago'
);

client.on("messageCreate", async (message) => {
	if (message.author.bot) return;
	if (message.content === '!help')
	{
		message.channel.send('!dailyHeathcliff: posts Heathcliff comic for todays date');
		message.channel.send('!randomHeathcliff: posts a random Heathcliff from the vault');
		message.channel.send('!addDaily: this channel will receive the daily Heathcliff comic every morning at 9am CST');
		message.channel.send('!removeDaily: this channel will no longer receive the daily Heathcliff comic. Note- if you have done !addDaily more than once on this channel and wish to remove every instance, you will have to !removeDaily more than once');
		return;
	}
	
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
	
	if (message.content === '!howManyServers')
	{
		await message.channel.send("I'm in " + client.guilds.cache.size + " servers!");
		return;
	}
	
	if (message.content === '!addDaily')
	{
		message.channelId.get;
		message.channel.name.get;
		const channelId = message.channelId;
		const channelName = message.channel.name;
		message.channel.send(channelName + " will now get the Daily Heathcliff comic at 9am CST every day!");
		
		const fs = require('fs');
		//fs.readFile('channels.txt', 'utf8', function(err, data){
      
			// Display the file content
			//message.channel.send(data);
		//});
		
		fs.appendFile('channels.txt',channelId +"\r\n", function (err) {
			//ir (err) throw err;
		});
		return;
	}
	
	if (message.content === '!removeDaily')
	{
		const fs = require('fs');
		message.channelId.get;
		const channelId = message.channelId;
		
		var data = fs.readFileSync('channels.txt', 'utf-8');

		var newValue = data.replace(channelId + "\r\n", '');
		fs.writeFileSync('channels.txt', newValue, 'utf-8');
		return;
	}
	
	if (message.content === '!readChannels')
	{
		const fs = require('fs');
		fs.readFile('channels.txt', 'utf8', function(err, data){
      
			// Display the file content
			message.channel.send(data);
		});
		return;
	}
	
	
	if (message.content ==='!randomApe')
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