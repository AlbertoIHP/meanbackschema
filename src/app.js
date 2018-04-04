import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import aws from 'aws-sdk'
import multer from 'multer'
import multerS3 from 'multer-s3'

const app = express(apiRoot, api)
const server = http.createServer(app)

/**
** SOCKET 
**/

import socketio from 'socket.io'
const websocket = socketio(server)



const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.S3_REGION,
});

// Initialize multers3 with our s3 config and other options
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME,
    acl: 'public-read',
    metadata(req, file, cb) 
    {
      cb(null, {fieldName: file.fieldname});
    },
    key(req, file, cb) 
    {
      var fileType = file.originalname.split('.')[file.originalname.split('.').length - 1 ]
      cb(null, Date.now().toString() + '.' + fileType);
    }
  })
})

app.post('/upload', upload.single('photo'), (req, res, next) => {
  res.json(req.file)
})

websocket.on( 'connection', (socket) => {

// Aqui se definen todos los eventos que cualquier cliente escucha, broadcast emite el evento a TODOS los clientes, mientras
// que emit, solo lo emite al cliente que ha gatillado el evento 

   socket.on( 'taskAdded', ( task ) =>  {
       socket.broadcast.emit('taskAdded', task)  
       socket.emit( 'taskAdded', task )     
   })



})


mongoose.connect(mongo.uri, { useMongoClient: true })
mongoose.Promise = Promise

setImmediate(() => {
  server.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

export default app
