module.exports = {
  name: 'hello',
  description: 'Gửi lời chào',
  execute: (senderId, args, sendMessage) => {
    const message = `Xin chào! Bạn đã gửi lệnh /hello với args: ${args.join(' ')}`;
    sendMessage(senderId, message);
  }
};
