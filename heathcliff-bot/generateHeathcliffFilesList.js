const { Storage } = require('@google-cloud/storage');
const { servicekey } = require('./config.json');
const fs = require('fs');

async function main() {
    const storage = new Storage({ keyFilename: servicekey });
    const bucket = storage.bucket('heathcliff-comics');
    let allFiles = [];
    let options = { autoPaginate: false };
    let page = 1;
    do {
        const [files, nextQuery] = await bucket.getFiles(options);
        allFiles = allFiles.concat(files.map(f => f.name));
        console.log(`Fetched ${allFiles.length} files so far... (page ${page})`);
        if (!nextQuery || !nextQuery.pageToken) break; // No more pages
        options = { autoPaginate: false, pageToken: nextQuery.pageToken };
        page++;
    } while (true);

    fs.writeFileSync('heathcliffFiles.json', JSON.stringify(allFiles, null, 2));
    console.log('File list saved!');
}
main();