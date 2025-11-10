const axios = require('axios');
const fs = require('fs');
const path = require('path');
const logger = require('./utils/logger');

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

// Hàm gửi tin nhắn
function sendMessage(recipientId, messageText) {
  const requestBody = {
    recipient: { id: recipientId },
    message: { text: messageText }
  };

  axios.post(`https://graph.facebook.com/v18.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, requestBody)
    .then(response => {
      logger.info(`Tin nhắn gửi thành công đến ${recipientId}`);
    })
    .catch(error => {
      logger.error(`Lỗi gửi tin nhắn: ${error.response?.data || error.message}`);
    });
}

// Load các lệnh từ thư mục modules
const commands = [];
const modulesPath = path.join(__dirname, 'modules');
fs.readdirSync(modulesPath).forEach(file => {
  if (file.endsWith('.js')) {
    const command = require(path.join(modulesPath, file));
    commands.push(command);
    logger.debug(`Đã load lệnh: ${command.name}`);
  }
});

// Hàm xử lý tin nhắn và lệnh
function handleMessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message.text;

  logger.info(`Nhận tin nhắn từ ${senderId}: ${messageText}`);

  if (messageText.startsWith('/')) {
    const parts = messageText.slice(1).split(' ');
    const commandName = parts[0];
    const args = parts.slice(1);

    const command = commands.find(cmd => cmd.name === commandName);
    if (command) {
      command.execute(senderId, args, sendMessage);
    } else {
      sendMessage(senderId, `Lệnh không tồn tại: /${commandName}. Gửi /help để xem danh sách.`);
    }
  } else {
    sendMessage(senderId, `Tôi là bot! Gửi lệnh bắt đầu bằng /, ví dụ /hello hoặc /help.`);
  }
}

module.exports = {
  sendMessage,
  handleMessage,
  commands
};
