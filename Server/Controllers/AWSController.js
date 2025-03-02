require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})


async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: 'hodosbucket',
        Key: key
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'hodosbucket',
        Key: `${filename}`,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}


module.exports = {
    putObject,
    getObjectUrl
}