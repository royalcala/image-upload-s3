const express = require('express')

const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

// for loading to s3 directly you can use the library multer-s3
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

const { uploadFile, getFileStream } = require('./s3')

const app = express()

app.get('/images/:key', async (req, res) => {
  console.log(req.params)
  const key = req.params.key
  try {
    const readStream = await getFileStream(key)
    readStream.pipe(res) 
  //  res.send(readStream)
  } catch (error) {
    console.log(error)
    res.send({error})
  }
  
})

app.post('/images', upload.single('image'), async (req, res) => {
  const file = req.file
  console.log(file)

  // apply filter
  // resize 

  const result = await uploadFile(file)
  await unlinkFile(file.path) // remove the file from the local directory of the local server
  console.log(result)
  const description = req.body.description
  res.send({imagePath: `/images/${result.Key}`})
})

app.listen(8080, () => console.log("listening on port 8080"))