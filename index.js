const {setAllData, setData} = require('./data/data')
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const bodyParser = require('body-parser')
const keys = require('./config/keys')
const path = require('path');
const io = require('socket.io')(http);
const PORT = process.env.PORT || 4005
const mainRoutes = require('./routes/main')

const socket = require('socket.io-client')(`http://localhost:4006/?login=${keys.login}&password=${keys.password}`, {
    transports: ['websocket']
});
socket.on('error', function () {
    console.log('error connection to server with data')
})
socket.on('connect', function () {
    console.log('server with data connected')
});
socket.on('disconnect', function () {
    console.log('server with data disconnected')
});
socket.on('firstData', function (data) {
    setAllData(data)
});
socket.on('newData', function (data) {
    setData(data)
    io.emit('newData', data)
});

app.use('/api/main', mainRoutes)
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '/client')));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.get('/*', function (req, res) {
    res.redirect('/');
});

http.listen(PORT, () => {
    console.log(`Server has been started on port:${PORT}`);
});