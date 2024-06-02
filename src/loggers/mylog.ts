const { createLogger, format, transports } = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');

const formatPrint = format.printf(
  ({ level, message, context, requestId, timestamp }) => {
    return `${timestamp}::${level}::${message}`;
  }
);

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    formatPrint
  ),
  transports: [
    new transports.Console(),
    // new DailyRotateFile({
    //   level: 'info',
    //   dirname: 'src/log',
    //   filename: 'application-%DATE%.log',
    //   datePattern: 'YYYY-MM-DD-HH-mm',
    //   zippedArchive: true,
    //   maxSize: '5m',
    //   maxFiles: '14d',
    //   format: format.combine(
    //     format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    //     formatPrint
    //   ),

    // }),
    new DailyRotateFile({
      level: 'error',
      dirname: 'src/log',
      filename: 'application-error-%DATE%.log', // Changed filename to differentiate error logs
      datePattern: 'YYYY-MM-DD-HH',// luu theo ngay => YYYY-MM-DD
      zippedArchive: true,
      maxSize: '5m',
      maxFiles: '14d',
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        formatPrint
      ),
    }),
  ],
});

export default logger
