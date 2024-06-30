// s3-validator.js
const AWS = require('aws-sdk');
const pdfParse = require('pdf-parse');

const s3 = new AWS.S3({
    accessKeyId: process.env.S3_KEY,
    secretAccessKey: process.env.S3_SECRET,
    region: 'ap-southeast-1'
});

async function isValidPdf(s3Bucket, fileName) {
    try {
        const params = {
            Bucket: s3Bucket,
            Key: process.env.S3_PREFIX + fileName,
        };
        console.log(params);
        const data = await s3.getObject(params).promise();
        const pdfData = await pdfParse(data.Body);
        return pdfData.numpages > 0;
    } catch (err) {
        console.error(err);
        return false;
    }
}

async function listPdfFiles(bucketName) {
    const params = {
        Bucket: bucketName,
        Delimiter: '/',
        MaxKeys: 10,
        Prefix: '/'
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        // Filter out only .pdf files at the root level
        const pdfFiles = data.Contents.filter(item => item.Key.endsWith('.pdf'));
        const pdfFilesKey = pdfFiles.map(file => file.Key)
        console.log({ pdfFilesKey })
        return pdfFilesKey;
    } catch (err) {
        console.error('Error fetching from S3:', err);
        return [];
    }
}

module.exports = {
    isValidPdf, listPdfFiles
};
