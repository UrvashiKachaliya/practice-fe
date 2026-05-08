import messageService from "../services/messageServices.js";

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    socket.on("send_message", (msg) => {
      messageService.saveMessage(msg);
      socket.broadcast.emit("receive_message", msg);
    });

    socket.on("get_messages", () => {
      messageService.getMessages((err, results) => {
        socket.emit("chat_history", results);
      });
    });
  });
};

export default chatSocket;