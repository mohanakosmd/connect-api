var winston = require('winston');
var fs = require('fs');
var logDir = 'log';
var moment = require('moment-timezone');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
var tsFormat = () => moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      json:false
    }),
    new (winston.transports.File)({
      filename: `${logDir}/results.log`,
      timestamp: tsFormat,
       json:false
    })
  ]
});

module.exports = logger;
