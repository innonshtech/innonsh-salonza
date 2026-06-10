import pino from 'pino';
import path from 'path';

// Helper to determine if we are in a serverless environment like Vercel where file writing isn't possible
const isVercel = process.env.VERCEL === '1';

const getTransports = () => {
  // If we are on Vercel or in the browser, just log to console (Vercel captures standard output)
  if (isVercel || typeof window !== 'undefined') {
    return pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard',
      },
    });
  }

  // In local/custom environments, use file streams + console
  return pino.transport({
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
        },
      },
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: path.join(process.cwd(), 'logs', 'app.log'), mkdir: true },
      },
      {
        target: 'pino/file',
        level: 'warn', // We'll manually log security events here as warnings or errors
        options: { destination: path.join(process.cwd(), 'logs', 'security.log'), mkdir: true },
      },
      {
        target: 'pino/file',
        level: 'info',
        options: { destination: path.join(process.cwd(), 'logs', 'audit.log'), mkdir: true },
      },
    ],
  });
};

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    base: {
      env: process.env.NODE_ENV,
    },
  },
  getTransports()
);

export const securityLogger = logger.child({ type: 'security' });
export const auditLogger = logger.child({ type: 'audit' });
