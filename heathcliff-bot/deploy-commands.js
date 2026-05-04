const { REST, Routes } = require('discord.js');
const { clientId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const commands = [];

// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
let commandFolders;
try {
	commandFolders = fs.readdirSync(foldersPath);
} catch (err) {
	console.error(`Failed to read commands folder at ${foldersPath}:`, err);
	process.exit(1);
}

console.log('Command folders found:', commandFolders);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	let commandFiles;
	try {
		commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	} catch (err) {
		console.warn(`Skipping ${commandsPath} (not a folder or unreadable):`, err.message);
		continue;
	}

	console.log(`Folder: ${folder} -> files:`, commandFiles);

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		let command;
		try {
			command = require(filePath);
		} catch (err) {
			console.error(`Error requiring ${filePath}:`, err.stack || err);
			continue;
		}

		if ('data' in command && 'execute' in command) {
			const json = command.data.toJSON();
			commands.push(json);
			console.log(`Added command: ${json.name} (from ${filePath})`);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);
		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationCommands(clientId), { body: commands });
		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();