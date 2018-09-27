const appRoot = require('app-root-path');
let winston = require('winston');
const tsFormat = () => ( new Date() ).toLocaleDateString() + ' - ' + ( new Date() ).toLocaleTimeString();


const options = {
    file: {
        level: 'info',
        filename: `${appRoot}/logs/app.log`,
        handleExceptions: true,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        timestamp: tsFormat
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: false,
        colorize: true,
    }
};

const moment = require('moment');

const { format } = winston;
const formatToJsonWithTimestamp = format.combine(
    format.label({ label: '[my-label]' }),
    format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.printf(info => `{"timestamp":"${info.timestamp}","level":"${info.level}","message":"${info.message}"}`)
);

let logger = winston.createLogger({
    format: formatToJsonWithTimestamp,
    transports: [
        new winston.transports.File(options.file)
       // , new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: function(message, encoding) {
      logger.info(moment().format('DD-MM-YYYY HH:mm:ss') + message);
    },
};

module.exports = logger;

