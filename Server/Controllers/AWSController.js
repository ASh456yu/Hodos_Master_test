require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const {SQS} = require('@aws-sdk/client-sqs')


const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

const sqs = new SQS({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
})

async function getObjectUrl(key) {
    const command = new GetObjectCommand({
        Bucket: 'hodos',
        Key: key
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function putObject(filename, contentType) {
    const command = new PutObjectCommand({
        Bucket: 'hodos',
        Key: `${filename}`,
        ContentType: contentType,
    });
    const url = await getSignedUrl(s3Client, command);
    return url;
}

async function awsSendMessage(params) {
    try {
        const data = await sqs.sendMessage(params);
        return data;
    } catch (error) {
        console.error(error);
        
    }
}

module.exports = {
    putObject,
    getObjectUrl,
    awsSendMessage,
}