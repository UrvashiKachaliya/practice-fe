import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const logsDir = path.join(__dirname, "logs");

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const isProd = process.env.NODE_ENV === "production";

// ── Console format (dev) ──────────────────────────────────────
const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
    return `${timestamp} [${level}] ${stack || message}${extra}`;
  })
);

// ── JSON format (production) ──────────────────────────────────
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json()
);

const logger = winston.createLogger({
  level: isProd ? "warn" : "http",
  format: isProd ? prodFormat : devFormat,
  transports: [
    // Always log to console
    new winston.transports.Console(),

    // Error log file — only errors
    new winston.transports.File({
      filename: path.join(logsDir, "error.log"),
      level: "error",
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5,
      format: combine(timestamp(), errors({ stack: true }), json()),
    }),

    // Combined log file — all levels
    new winston.transports.File({
      filename: path.join(logsDir, "combined.log"),
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 10,
      format: combine(timestamp(), json()),
    }),
  ],
});

export default logger;
