import { v4 as uuidv4 } from "uuid";
import db from "../config/db.js";

// save message
const saveMessage = (message) => {
  const id = uuidv4();

  db.query(
    "INSERT INTO messages (id, message) VALUES (?, ?)",
    [id, message]
  );
};

// get all messages
const getMessages = (callback) => {
  db.query(
    "SELECT * FROM messages ORDER BY created_at ASC",
    callback
  );
};

export default {
  saveMessage,
  getMessages,
};