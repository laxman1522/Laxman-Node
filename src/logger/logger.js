"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { createLogger, transports, format } = require('winston');
const logger = createLogger({
    format: format.printf((info) => {
        return `[ ${info.level.toLocaleUpperCase()} ] - ${info.message}`;
    }),
    level: 'debug',
    transports: [
        new transports.Console()
    ]
});
exports.default = logger;
