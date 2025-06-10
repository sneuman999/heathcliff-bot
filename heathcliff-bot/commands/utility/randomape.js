const { SlashCommandBuilder } = require('discord.js');
const { Storage } = require('@google-cloud/storage');
const { servicekey } = require('./config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("randomape")
        .setDescription("Ape Surprise!"),
    async execute(interaction) {

        await interaction.deferReply();

        // Load the prebuilt list of Garbage Ape files
        const listPath = path.join(__dirname, 'garbageApeFiles.json');
        let garbageApeFiles;
        try {
            garbageApeFiles = JSON.parse(fs.readFileSync(listPath, 'utf8'));
        } catch (err) {
            await interaction.editReply({ content: "Could not load Garbage Ape file list." });
            return;
        }

        if (!garbageApeFiles || garbageApeFiles.length === 0) {
            await interaction.editReply({ content: "No Garbage Ape comics found!" });
            return;
        }

        const bucketName = 'heathcliff-comics';
        const randomIndex = Math.floor(Math.random() * garbageApeFiles.length);
        const randomFile = garbageApeFiles[randomIndex];
        const fileDate = randomFile.slice(0, -4);
        const url = `https://storage.googleapis.com/${bucketName}/${randomFile}`;

        try {
            await interaction.editReply({ content: "Garbage Ape comic from " + fileDate + ":\n" + url });
            console.log("I posted a Garbage Ape comic!");
        } catch (err) {
            console.log("I experienced a message error");
            return;
        }

        return;
    },
};