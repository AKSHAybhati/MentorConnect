import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();
  const socketUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const userId = user?.id || user?._id;

  useEffect(() => {
    if (userId) {
      const newSocket = io(socketUrl);
      
      newSocket.emit('join-room', userId);
      
      newSocket.on('receive-message', (message) => {
        // Handle incoming messages
        console.log('New message received:', message);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [userId, socketUrl]);

  const sendMessage = (receiverId, content) => {
    if (socket) {
      socket.emit('send-message', {
        senderId: userId,
        receiverId,
        content,
        timestamp: new Date()
      });
    }
  };

  const value = {
    socket,
    onlineUsers,
    sendMessage
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};