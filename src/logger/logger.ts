const { createLogger, transports, format } = require('winston');

const logger = createLogger({
  format: format.printf((info:any) => {
    return `[ ${info.level.toLocaleUpperCase()} ] - ${info.message}`
  }),
  level: 'debug',
  transports: [
    new transports.Console()
  ]
});

export default logger;