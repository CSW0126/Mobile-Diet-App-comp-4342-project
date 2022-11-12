const http = require('http')
const app = require('./app')
const port = process.env.PORT || 3000;
const server = http.createServer(app)
require('dotenv').config();


server.listen(port)
//log
console.log("Listen: " + process.env.HOST + ":" + port);