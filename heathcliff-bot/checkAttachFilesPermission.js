const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
});

const token = process.env.BOT_TOKEN || require('./config.json').token;

async function checkPermissions() {
    const channelsFile = path.join(__dirname, 'channels.txt');
    const lines = fs.readFileSync(channelsFile, 'utf8').split('\n').filter(Boolean);

    let notFoundCount = 0;
    let canAttachCount = 0;
    let cannotAttachCount = 0;

    for (const line of lines) {
        const channelId = line.split(',')[0].trim();
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) {
            notFoundCount++;
            console.log(`Channel not found: ${channelId}`);
            continue;
        }
        const hasAttach = channel.permissionsFor(channel.guild.members.me).has(PermissionsBitField.Flags.AttachFiles);
        if (hasAttach) {
            canAttachCount++;
            console.log(`Bot CAN attach files in channel: ${channelId}`);
        } else {
            cannotAttachCount++;
            console.log(`Bot CANNOT attach files in channel: ${channelId}`);
        }
    }

    console.log('\nSummary:');
    console.log(`Channels not found: ${notFoundCount}`);
    console.log(`Channels where bot CAN attach files: ${canAttachCount}`);
    console.log(`Channels where bot CANNOT attach files: ${cannotAttachCount}`);
    process.exit(0);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    checkPermissions();
});

client.login(token);