module.exports = {
  "provider": "aws-s3",
  "providerOptions": 
  {
    "accessKeyId": process.env.AWS_ACCESS_KEY_ID,
    "secretAccessKey": process.env.AWS_ACCESS_SECRET,
    "region": 'eu-central-1',
    "params": {
      "Bucket": 'skauttrebic.cz',
    },
  }
};

// module.exports = {
//   "provider": "cloudinary",
//   "providerOptions": 
//   {
//     "cloud_name": process.env.CLOUDINARY_CLOUD_NAME,
//     "api_key": process.env.CLOUDINARY_API_KEY,
//     "api_secret": process.env.CLOUDINARY_API_SECRET
//   }
// };
