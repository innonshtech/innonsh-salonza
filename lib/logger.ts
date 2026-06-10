import winston from 'winston';
import path from 'path';

const isVercel = process.env.VERCEL === '1';

const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: isVercel ? customFormat : consoleFormat,
  }),
];

if (!isVercel) {
  transports.push(
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'app.log'),
      level: 'info',
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'security.log'),
      level: 'warn',
    }),
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'audit.log'),
      level: 'info',
    })
  );
}

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: customFormat,
  defaultMeta: { env: process.env.NODE_ENV },
  transports,
});

export const securityLogger = logger.child({ type: 'security' });
export const auditLogger = logger.child({ type: 'audit' });
