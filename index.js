const express = require('express');
const bodyParser = require('body-parser');
const path = require("path");
const app = express();
const WebSocket = require('ws');
const http = require('http');
const server = http.createServer(app);
const WebSocketServer = WebSocket.Server;
const wss = new WebSocketServer({server: server});
let pathToHTML="/views/auth.html";
const admin={
    login:"admin",
    password:'admin123',
    "bank-account":{
        "card-num":"*9084343432",
        "card-pin":"543"
    }
};
let photo = "google.png";

let isAdmin =false;
app.set("views", path.join(__dirname, "./views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./views'));
app.get('/', (req, res) => {
    res.sendFile(__dirname+'/views/title.html');
});

app.get('/eval', (req, res) => {
    res.sendFile(__dirname+'/views/eval.html');
});
app.get('/auth', (req, res) => {
    res.sendFile(__dirname+pathToHTML);
});
app.get('/RFI', (req, res) => {
    res.sendFile(__dirname+"/views/rfd.html");
});
app.get('/admin', (req, res) => {
    if (isAdmin){
        res.sendFile(__dirname+'/views/admin.html');
    }
    else{
        res.sendFile(__dirname+"/views/auth.html")
    }
});

wss.on('connection', function (ws) {
    ws.send(JSON.stringify({
        type:"photo",
        value:photo
    }));
    ws.onmessage = response => {
        const json = JSON.parse(response.data);
        console.log('received: %s', response.data);
        if (json.type==="eval"){
           try {
               const result =eval(json.value);
               ws.send(JSON.stringify({
                   type:"eval",
                   value:result
               }));
           }catch (e) {
               ws.send(JSON.stringify({
                   type:"eval",
                   value:e.toString()
               }));
           }
        }
        else if (json.type ==='photo'){
            photo =json.value
        }
    };
});

let port_number =process.env.PORT || 3000;
server.listen(port_number,'0.0.0.0', () => console.log('Example app listening on port 3000!'));


