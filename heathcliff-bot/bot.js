// Run dotenv
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});
const { clientId, guildId, token, testChannelId } = require('./config.json');

client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
		
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
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
			
			try { 
			channel.send(url);
			}
			catch (err) {
				console.log("I experienced a message error on the Daily");
				return;
			}
		});
		
		

	},
	null,
	true,
	'America/Chicago'
);


client.on("messageCreate", async (message) => {
	
	if (message.author.bot) return;
	
	if (message.content === '!HamBot') {
		try {
			await message.channel.send('!dailyHeathcliff: posts Heathcliff comic for todays date.');
			await message.channel.send('!randomHeathcliff: posts a random Heathcliff comic from the vault.');
			await message.channel.send('!addDaily: this channel will receive the daily Heathcliff comic every morning at 9am CST.');
			await message.channel.send('!removeDaily: this channel will no longer receive the daily Heathcliff comic.');
			await message.channel.send('!hambotSupport: gives links for HamBot support.')
		}
		catch (err) {
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	}
	
	if (message.content === '!dailyHeathcliff') {
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();

		today = yyyy + '/' + mm + '/' + dd;
	
		var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
	
		try {
			await message.channel.send(url); 
			console.log("I posted the Daily Heathcliff");
		} 
		catch(err){
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	}
	
	if (message.content ==='!randomHeathcliff') {
		var today = new Date();
		var randomDate = new Date();
		var dd = String(Math.floor(Math.random() * 28) + 1);
		var mm = String(Math.floor(Math.random() * 12) + 1);
		var yyyy = String(Math.floor(Math.random() * 14) + 2009);
			
		randomDate = yyyy + '/' + mm + '/' + dd;
		var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			
		try {
			await message.channel.send(url);
			console.log("I posted a random Heathcliff"); 
		} 
		catch(err){
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	}
	
	if (message.content === '!howManyServers') {
		message.channelId.get;
		const channelId = message.channelId;
		
		if (channelId === testChannelId) {
			try {
				await message.channel.send("I'm in " + client.guilds.cache.size + " servers!");
			}
			catch(err){
				await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
				console.log("I experienced a message error");
				return;
			}
		}
			return;
	}
	
	if (message.content === '!addDaily') {
		await message.channelId.get;
		message.channel.name.get;
		const channelId = message.channelId;
		const channelName = message.channel.name;
		
		const fs = require('fs');
		fs.readFile('channels.txt', 'utf8', function(err, data){
			if(!(data.includes(channelId))){
				try {
					message.channel.send(channelName + " will now receive the daily Heathcliff comic at 9am CST every day!");
					fs.appendFile('channels.txt',channelId +"\r\n", function (err) {
						if (err) throw err;
					});
				}
				catch(err){
					message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
					console.log("I experienced a message error");
					return;
				}
			}
			else {
				try {
					message.channel.send(channelName + " is already receiving the daily Heathcliff comic at 9am CST every day!");
				}
				catch(err){
					message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
					console.log("I experienced a message error");
					return;
				}
			}
		});
		return;
	}
	
	if (message.content === '!removeDaily') {
		const fs = require('fs');
		message.channelId.get;
		message.channel.name.get;
		const channelId = message.channelId;
		const channelName = message.channel.name;
		
		try {
			await message.channel.send(channelName + " will no longer receive the daily Heathcliff comic.");
		}
		catch(err){
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		
		var data = fs.readFileSync('channels.txt', 'utf-8');

		var newValue = data.replace(channelId + "\r\n", '');
		fs.writeFileSync('channels.txt', newValue, 'utf-8');
	}
	
	if (message.content === '!readChannels') {
		
		message.channelId.get;
		const channelId = message.channelId;
		
		if (channelId === testChannelId) {
					const fs = require('fs');
			
			fs.readFile('channels.txt', 'utf8', function(err, data){
				try {
					message.channel.send(data);
				}
				catch(err){
					message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
					console.log("I experienced a message error");
					return;					
				}
			});
		}
		return;
	}

	if (message.content === '!hambotSupport') {
		try {
			await message.channel.send("ToS and Privacy Policy: https://github.com/sneuman999/heathcliff-bot/blob/104307fae98c852c671f8b8e27c1f5e02eb51fc2/ToS%20and%20Privacy%20Policy");
			await message.channel.send("For support questions, contact hambotdiscord@gmail.com.");
		}
		catch (err) {
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
    }
	
	if (message.content ==='!randomApe') {
		try {
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
			await message.channel.send("Behold the Garbage Ape!");
			await message.channel.send(url);
		}
		catch(err){
			await message.author.send("I don't have permission to post in " + message.channel.name + ". Ask your Server Admin for help");
			console.log("I experienced a message error");
			return;
		}
		return;
	}
})

client.login(token);
