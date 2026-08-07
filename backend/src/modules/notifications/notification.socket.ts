let io: any = null;

const setSocketIO = (socketServer: any) => {
  io = socketServer;
};

const emitNotification = (
  userId: string,
  notification: any
) => {
  if (!io) {
    console.warn(
      'Socket.IO is not initialized. Notification saved but not emitted.'
    );
    return;
  }

  io.to(`user:${userId}`).emit(
    'notification',
    notification
  );
};

module.exports = {
  setSocketIO,
  emitNotification,
};

export {};
