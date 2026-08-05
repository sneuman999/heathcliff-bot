// Run dotenv
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const axios = require('axios');
const https = require('node:https');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { Storage } = require('@google-cloud/storage');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
});
const { token , servicekey } = require('./config.json');

let currentReadline = null;

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

client.removeAllListeners(Events.InteractionCreate);
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

client.removeAllListeners('ready');	
client.on('ready', async () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

process.on('SIGINT', gracefulShutdown);
async function gracefulShutdown() {
    console.log("Graceful shutdown initiated...");
    // Close any open readline interface
    if (currentReadline) {
     try {
            currentReadline.close();
            console.log("Readline interface closed.");
        } catch (error) {
         console.error("Error closing readline interface:", error);
        } finally {
            currentReadline = null;
        }
    }

    // Destroy the Discord client
    try {
        await client.destroy();
        console.log("Discord client destroyed.");
    } catch (error) {
        console.error("Error destroying Discord client:", error);
    }
}

var cron = require('node-cron');

//Cron job to post daily Heathcliff comic
cron.schedule('0 0 * * * *', async () => {
	const date = new Date();
	const hour = date.getHours();
	let hourString = hour.toString();

	if (hourString.length == 1) {
		hourString = '0' + hourString;
    }
	console.log(hour);
	await cronDaily(hourString);
});

let newComicUploaded = false;
searchDate = new Date();
searchDate.setUTCHours(0, 0, 0, 0);

//Cron job to start the search for a new comic at 11pm
cron.schedule('00 30 23 * * *', async () => {
    newComicUploaded = false;
    //this records in UTC, which will be "tomorrow".
    searchDate = new Date();
    searchDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight
});

//Cron job to check for a new comic every 10 minutes
cron.schedule('0 */10 * * * *', async () => {
    try {
        if (!newComicUploaded) {
            const titleProp = await comicScrape('article:published_time');
            if (!titleProp) {
                console.log("comicScrape returned null for published_time; skipping this cycle.");
                return;
            }

            const comicTitle = titleProp.toString().substring(0, 10);
            const comicDate = new Date(comicTitle);
            comicDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight

            if (comicDate.getTime() === searchDate.getTime()) {
                const comicURL = await comicScrape('og:image');
                if (!comicURL) {
                    console.error("comicScrape returned null for og:image; cannot download.");
                    return;
                }

                const localPath = `png holding/${comicTitle}.png`;
                await downloadImage(comicURL, localPath);
                await uploadImage(localPath, 'heathcliff-comics', `${comicTitle}.png`);
                await deleteImage(localPath);

                newComicUploaded = true;
                console.log("New comic uploaded:", comicTitle);

                // Update heathcliffFiles.json
                try {
                    const filesPath = require('path').join(__dirname, 'commands', 'utility', 'heathcliffFiles.json');
                    let filesList = [];
                    if (fs.existsSync(filesPath)) {
                        filesList = JSON.parse(fs.readFileSync(filesPath, 'utf8'));
                    }
                    if (!filesList.includes(`${comicTitle}.png`)) {
                        filesList.push(`${comicTitle}.png`);
                        fs.writeFileSync(filesPath, JSON.stringify(filesList, null, 2));
                        console.log("heathcliffFiles.json updated.");
                    }
                } catch (err) {
                    console.error("Failed to update heathcliffFiles.json:", err);
                }
            } else {
                console.log("No new comic uploaded. Current date:", comicDate, "Search date:", searchDate);
            }
        }
    } catch (err) {
        console.error("Error in scheduled comic check:", err);
    }
});

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode === 200) {
                const fileStream = fs.createWriteStream(filepath);
                res.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    console.log("Image downloaded successfully to:", filepath);
                    resolve();
                });

                fileStream.on('error', (err) => {
                    console.error("Error writing to file:", err.message);
                    fileStream.close();
                    reject(err);
                });
            } else {
                console.error("Error downloading image. Status code:", res.statusCode);
                res.destroy();
                reject(new Error(`Status code: ${res.statusCode}`));
            }
        }).on('error', (err) => {
            console.error("Error during download:", err.message);
            reject(err);
        });
    });
}

const os = require('os'); // Import the os module to detect the platform
async function comicScrape(property) {
    const url = 'https://creators.com/read/heathcliff';
    const maxAttempts = 3;
    const timeoutMs = 15000; // 15s per request
    const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36';

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            const resp = await axios.get(url, {
                timeout: timeoutMs,
                headers: { 'User-Agent': userAgent, 'Accept': 'text/html' },
                validateStatus: status => status >= 200 && status < 400
            });

            const html = resp.data;
            // Regex to find <meta property="..." content="..."> (case-insensitive)
            const re = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
            const m = html.match(re);
            if (m && m[1]) {
                return m[1];
            }

            // Fallback: sometimes sites use meta[name="..."] instead of property
            const reName = new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']*)["'][^>]*>`, 'i');
            const m2 = html.match(reName);
            if (m2 && m2[1]) {
                return m2[1];
            }

            // If no meta tag found, return null (no point retrying)
            return null;
        } catch (err) {
            console.error(`comicScrape (axios) attempt ${attempt} error:`, err.message || err);

            // On last attempt return null
            if (attempt === maxAttempts) {
                return null;
            }

            // Backoff before retrying
            await new Promise(res => setTimeout(res, 1000 * attempt));
        }
    }

    return null;
}

async function uploadImage(imagePath, bucketName, imageName) {
  const storage = new Storage({
	keyFilename: servicekey,
  });
  const bucket = storage.bucket(bucketName);

  try {
	await bucket.upload(imagePath, {
	  destination: imageName,
	});
	console.log(`${imageName} uploaded to ${bucketName}`);
	const file = bucket.file(imageName)
	await file.makePublic();
	const publicUrl = file.publicUrl();
	console.log(`File available at ${publicUrl}`)
	return publicUrl
  } catch (error) {
	console.error('Error uploading image:', error);
	throw error;
  }
}

async function deleteImage(filepath) {
    const fs = require('fs').promises;
    try {
        await fs.unlink(filepath);
        console.log(`Deleted local file: ${filepath}`);
    } catch (err) {
        console.error(`Error deleting file ${filepath}:`, err);
    }
}

function cronDaily(cronTime) {
    const fs = require('fs');
    const readline = require('readline');
    const currentdate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const comicURL = `https://storage.googleapis.com/heathcliff-comics/${currentdate}.png`;

    // Close previous reader if open
    if (currentReadline) {
        try { currentReadline.close(); } catch (e) {}
        currentReadline = null;
    }

    // Create a readable stream from the file
    currentReadline = readline.createInterface({
        input: fs.createReadStream(path.join(__dirname, 'channels.txt')),
        output: process.stdout,
        terminal: false
    });

    // Process each line in the file
    currentReadline.on('line', async (line) => {
        const separatedLine = line.split(',').map(s => s.trim());
        const channel = client.channels.cache.get(separatedLine[0]);

        if (separatedLine[1] === cronTime) {
            try {
                if (channel) {
                    await channel.send(`Heathcliff comic for today:\n${comicURL}`);
                    console.log("I posted the Daily Heathcliff");
                } else {
                    console.warn(`Channel ${separatedLine[0]} not found in cache.`);
                }
            } catch (error) {
                console.error("I experienced a message error:", error);
            }
        }
    });

    // Clear reference when closed
    currentReadline.on('close', () => {
        currentReadline = null;
    });
}

client.login(token);