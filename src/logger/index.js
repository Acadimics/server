const Logger = require('js-logger');
Logger.useDefaults();
Logger.setLevel(Logger.DEBUG);

var consoleHandler = Logger.createDefaultHandler({
    formatter: (msg, context) => {
        msg.unshift(`[${new Date().toLocaleString()}]::${context.level.name}::`)
    }
});

Logger.setHandler((msg, context) => {
    consoleHandler(msg, context);
});

function debug(tag, func, info) {
    Logger.debug(`[${tag}] [${func}]`, '\n\t', info);
}

function info(tag, func, info) {
    Logger.info(`[${tag}] [${func}]`, '\n\t', info);
}

function error(tag, func, info) {
    Logger.error(`[${tag}] [${func}]`, '\n\t', info);
}

module.exports.debug = debug;
module.exports.info = info;
module.exports.error = error;