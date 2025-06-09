// Run dotenv
require('dotenv').config();

const fs = require('node:fs');
const path = require('node:path');
const puppeteer = require('puppeteer');
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

let browser;
let page;

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

    // Close Puppeteer browser instance if it exists
    if (browser) {
        try {
            await browser.close();
            console.log("Puppeteer browser instance closed.");
        } catch (error) {
            console.error("Error closing Puppeteer browser:", error);
        }
    }

    // Close any open file streams (e.g., readline interface)
    if (typeof file !== 'undefined' && file) {
     try {
            file.close();
            console.log("Readline interface closed.");
        } catch (error) {
         console.error("Error closing readline interface:", error);
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
cron.schedule('00 00 * * * *', async () => {
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
searchDate.setDate(searchDate.getDate());

cron.schedule('00 00 23 * * *', async () => {
    newComicUploaded = false;
    searchDate = new Date();
    searchDate.setDate(searchDate.getDate()+1);
    searchDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight
    searchDate.setDate(searchDate.getDate());
});

cron.schedule('0 */30 * * * *', async () => {
    if (!newComicUploaded) {
        let comicTitle = (await comicScrape('article:published_time')).toString().substring(0, 10);
        let comicDate =  new Date(comicTitle);
        comicDate.setUTCHours(0, 0, 0, 0); // Reset time to midnight
        if (comicDate.getTime() === searchDate.getTime())
        { 
            let comicURL = await comicScrape('og:image');
        	await downloadImage(comicURL, 'png holding/' + comicTitle + '.png');
	        await uploadImage('png holding/' + comicTitle + '.png', 'heathcliff-comics', comicTitle + '.png');
            await deleteImage('png holding/' + comicTitle + '.png');
            newComicUploaded = true;
            console.log("New comic uploaded. Current date:", comicDate, "Search date:", searchDate);
            console.log("New comic uploaded:", comicTitle);
        }
        else 
        {
            console.log("No new comic uploaded. Current date:", comicDate, "Search date:", searchDate);
        }
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
    // Detect if the program is running on a Raspberry Pi
    const isRaspberryPi = os.platform() === 'linux' && os.arch() === 'arm';

    // Launch Puppeteer with Raspberry Pi-specific options if running on a Pi
    if (!browser) {
        browser = await puppeteer.launch({
            headless: false,
            executablePath: isRaspberryPi ? '/usr/bin/chromium-browser' : undefined, // Use system Chromium on Pi
            args: isRaspberryPi
                ? [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--no-zygote',
                    '--single-process',
                ]
                : [], // No special args for non-Pi systems
        });
    }

    if (!page) {
        page = await browser.newPage();
    }

    try {
        // Navigate to the Heathcliff comic page
        await page.goto("https://creators.com/read/heathcliff", { waitUntil: "domcontentloaded" });

        // Scrape the content of the meta tag with the specified property
        const comicProperty = await page.evaluate((property) => {
            const metaTag = document.querySelector(`meta[property="${property}"]`);
            return metaTag ? metaTag.content : null;
        }, property);

        return comicProperty;
    } catch (error) {
        console.error("Error during web scraping:", error);
        return null;
    }
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

    // Create a readable stream from the file
    const file = readline.createInterface({
        input: fs.createReadStream('channels.txt'),
        output: process.stdout,
        terminal: false
    });

    // Process each line in the file
    file.on('line', async (line) => {
        const separatedLine = line.split(', ');
        const channel = client.channels.cache.get(separatedLine[0]);

        if (separatedLine[1] === cronTime) {
            try {
                await channel.send(`Heathcliff comic for today:\n${comicURL}`);
                console.log("I posted the Daily Heathcliff");
            } catch (error) {
                console.error("I experienced a message error:", error);
            }
        }
    });

    // Close the file after processing
    file.on('close', () => {
        // File closed silently
    });
}

client.login(token);