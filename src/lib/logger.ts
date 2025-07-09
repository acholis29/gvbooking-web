// lib/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

// Buat direktori logs jika belum ada
import fs from 'fs';
const logDir = path.resolve(process.cwd(), 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, stack }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
        })
    ),
    transports: [
        new transports.Console(), // log ke console
        new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' }),
        new transports.File({ filename: path.join(logDir, 'combined.log') }),
    ],
});

export default logger;
