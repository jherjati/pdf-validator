// index.js
const { getFilesInFolder, updateFileValidity } = require('./db');
const { isValidPdf, /* listPdfFiles */ } = require('./s3-validator');

const folderId = process.env.FOLDER_ID;
const s3Bucket = process.env.S3_BUCKET;

async function validatePdfFiles() {
    const files = await getFilesInFolder(folderId);
    for (const file of files) {
        const isValid = await isValidPdf(s3Bucket, file.filename_disk);
        await updateFileValidity(file.id, isValid);
        console.log(`Updated file validity to ${isValid}: ${file.filename_disk}`);
    }
}

validatePdfFiles();
