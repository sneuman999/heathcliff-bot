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

var cron = require('node-cron');
cron.schedule('00 40 * * * *', async () => {
	const date = new Date();
	const hour = date.getHours();
	let hourString = hour.toString();

	if (hourString.length == 1) {
		hourString = '0' + hourString;
    }
	console.log(hour);
	await cronDaily(hourString);
});

function cronDaily(cronTime) {
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
	file.on('line', async (line) => {

		separatedLine = line.split(', ');
		var channel = client.channels.cache.get(separatedLine[0]);

		if (separatedLine[1] === cronTime) {
			var today = new Date();
			var dd = String(today.getDate()).padStart(2, '0');
			var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = today.getFullYear();

			randomDate = yyyy + '/' + mm + '/' + dd;
			var url = String('https://www.gocomics.com/heathcliff/' + yyyy + '/' + mm + '/' + dd);
			try {
				await channel.send(url);
			}
			catch (error) {
				var data = fs.readFileSync('channels.txt', 'utf-8');
				var dataSplit = data.split('\r\n');
				const filteredArray = dataSplit.filter(item => !item.includes(separatedLine[0]));
				var newValue = filteredArray.join('\r\n');
				fs.writeFileSync('channels.txt', newValue, 'utf-8');
				console.log("I experienced an error posting the daily.");
			}
		}
		else {
			return;
        }
	});
	return;
}



client.login(token);
