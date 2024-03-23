const {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} = require("@aws-sdk/client-s3");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const deleteObjects = async (uploadedImageKeys) => {
  // [{Key: 'image.png'}, ...]
  const command = new DeleteObjectsCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Delete: {
      Objects: uploadedImageKeys,
    },
  });
  return await s3.send(command);
};

const deleteObject = async (uploadedImageKey) => {
  // [{Key: 'image.png'}, ...]
  const command = new DeleteObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: uploadedImageKey,
  });
  return await s3.send(command);
};

const uploadObject = async (image) => {
  const key = Date.now().toString() + "-" + image.originalname;
  const putParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: image.buffer,
    ContentType: image.mimetype,
  };
  await s3.send(new PutObjectCommand(putParams));
  const imageUrl = getUrlFromBucket(key);
  return { url: imageUrl, name: key };
};

const getUrlFromBucket = (key) => {
  return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`;
}; 

module.exports = {
  getUrlFromBucket,
  deleteObjects,
  deleteObject,
  uploadObject,
};
