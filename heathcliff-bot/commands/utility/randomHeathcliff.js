const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("randomheathcliff")
        .setDescription("posts a random Heathcliff comic from the vault."),
    async execute(interaction) {
        await interaction.deferReply();

        const listPath = path.join(__dirname, 'heathcliffFiles.json');
        let heathcliffFiles;
        try {
            heathcliffFiles = JSON.parse(fs.readFileSync(listPath, 'utf8'));
        } catch (err) {
            await interaction.editReply({ content: "Could not load Heathcliff file list." });
            return;
        }

        if (!heathcliffFiles || heathcliffFiles.length === 0) {
            await interaction.editReply({ content: "No Heathcliff comics found!" });
            return;
        }

        const bucketName = 'heathcliff-comics';
        const randomIndex = Math.floor(Math.random() * heathcliffFiles.length);
        const randomFile = heathcliffFiles[randomIndex];
        const fileDate = randomFile.slice(0, -4);
        const url = `https://storage.googleapis.com/${bucketName}/${randomFile}`;

        try {
            await interaction.editReply({ content: "Heathcliff comic from " + fileDate + ":\n" + url });
            console.log("I posted a Random Heathcliff");
        } catch (err) {
            console.log("I experienced a message error");
            return;
        }
        return;
    },
};