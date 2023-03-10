const pino = require('pino')

const levels = {
    http: 10,
    debug: 20,
    info: 30,
    warn: 40,
    error: 50,
    fatal: 60,
  };
module.exports = pino(
  {
    formatters: {
        level: (label) => {
          return { level: label.toUpperCase() };
        },
      },
    customLevels: levels, // our defined levels
    useOnlyCustomLevels: true,
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
   
  },
  pino.destination(`${__dirname}/../server.log`)
)