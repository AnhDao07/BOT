module.exports = {
  name: 'help',
  description: 'Hiển thị danh sách lệnh',
  execute: (senderId, args, sendMessage) => {
    const commands = require('../mirai').commands; // Import từ mirai.js
    let helpText = 'Danh sách lệnh:\n';
    commands.forEach(cmd => {
      helpText += `/${cmd.name}: ${cmd.description}\n`;
    });
    sendMessage(senderId, helpText);
  }
};
