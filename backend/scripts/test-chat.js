const { io } = require('socket.io-client');

const TOKEN = process.env.INVITEE_TOKEN;
const PROJECT_ID = 'cmsao0e9a0001iykt4dj1ciet';

if (!TOKEN) {
  console.error('INVITEE_TOKEN is not set');
  process.exit(1);
}

const socket = io('http://localhost:5000', {
  auth: {
    token: TOKEN
  }
});

socket.on('connect', () => {
  console.log('CONNECTED:', socket.id);

  socket.emit(
    'join-project',
    PROJECT_ID,
    (response) => {
      console.log('JOIN RESPONSE:', response);

      if (!response.success) {
        socket.disconnect();
        return;
      }

      socket.emit(
        'send-message',
        {
          projectId: PROJECT_ID,
          content: 'Hello from the Socket.IO backend test!'
        },
        (response) => {
          console.log('SEND RESPONSE:', response);

          setTimeout(() => {
            socket.disconnect();
          }, 1000);
        }
      );
    }
  );
});

socket.on('new-message', (message) => {
  console.log(
    'NEW MESSAGE:',
    JSON.stringify(message, null, 2)
  );
});

socket.on('chat-error', (error) => {
  console.error('CHAT ERROR:', error);
});

socket.on('connect_error', (error) => {
  console.error('CONNECTION ERROR:', error.message);
});

socket.on('disconnect', (reason) => {
  console.log('DISCONNECTED:', reason);
});
