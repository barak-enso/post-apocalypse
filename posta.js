const express = require('express');
var cors = require('cors');
const port = 28010;
// const SocketServer = require('ws').Server;
const Logger = require("chillogger");
const appFactory = require("./app-factory");
let [image, script, ...args] = process.argv;


switch (true) {
    case args.indexOf("-vv") > -1:
      Logger.setGlobalTrace(true);
      Logger.setGlobalLevel(4);
      Logger.setGlobalVerbosity(2);
      break;
    case args.indexOf("-v") > -1:
      Logger.setGlobalTrace(true);
      Logger.setGlobalLevel(3);
      Logger.setGlobalVerbosity(1);
      break;
    default:
      break;
  }
const flags = new Set(args)


const log = new Logger("Main");
appFactory(flags.has("--dev") || flags.has("-d"));
var app = express();
require('express-ws')(app);
app.use(cors());
app.use(express.static('dist'))
app.post("/", (req, res) => req.pipe(res));

var malWindows = new Set()

app.ws('/malwindow-api', function(ws, req) {
  ws.on("close", () => malWindows.delete(ws))
  log.info(`new connection to from origin ${req.headers.origin}`)
  malWindows.add(ws)
});

app.ws('/agent-api', function(ws, req) {
  log.info(`new agent connection from origin ${req.headers.origin}`)
  ws.on('message', function(msg) {
    malWindows.forEach(mw=>{
      try {
        mw.send(msg);    
      } catch (error) {
        console.log(error)
      }
    })
  });
  
});

app.listen(port, function () {
    log.info('posta listening on port: ' + port + ", with websockets listener")
})
