/**
 * Application Logger Utility
 * Provides structured log formatting with ISO timestamps and severity levels.
 */

const isProduction = process.env.NODE_ENV === 'production';

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta && Object.keys(meta).length ? ` | ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
};

export const logger = {
  info: (message, meta = {}) => {
    console.log(formatMessage('info', message, meta));
  },
  warn: (message, meta = {}) => {
    console.warn(formatMessage('warn', message, meta));
  },
  error: (message, meta = {}) => {
    console.error(formatMessage('error', message, meta));
  },
  debug: (message, meta = {}) => {
    if (!isProduction) {
      console.debug(formatMessage('debug', message, meta));
    }
  }
};

export default logger;
