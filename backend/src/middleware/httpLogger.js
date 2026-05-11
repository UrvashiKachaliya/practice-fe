import morgan from "morgan";
import logger from "../utils/logger.js";

// Pipe morgan output into winston
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Format: method url status response-time ms — user-agent
const format = ':method :url :status :res[content-length] - :response-time ms ":user-agent"';

const httpLogger = morgan(format, { stream });

export default httpLogger;
