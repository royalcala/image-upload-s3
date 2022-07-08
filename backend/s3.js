require('dotenv').config()
const fs = require('fs')
const S3 = require('aws-sdk/clients/s3')

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
})

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path)

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile


// downloads a file from s3
async function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName
  }
  try {
      return s3.getObject(downloadParams)?.createReadStream()
    // const data = await s3.getObject(downloadParams).promise();
    // return data.Body.toString('utf-8');
  } catch (e) {
    //console.log(`Could not retrieve file from S3: ${e.message}`)
     throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}
exports.getFileStream = getFileStream