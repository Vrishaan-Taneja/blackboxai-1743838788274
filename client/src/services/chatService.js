import api from './api';

export const sendMessage = async (content, recipientType, recipientId) => {
  try {
    const response = await api.post('/chat', {
      content,
      recipientType,
      recipientId
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to send message' };
  }
};

export const getMessages = async (recipientType, recipientId) => {
  try {
    const response = await api.get(`/chat/${recipientType}/${recipientId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch messages' };
  }
};

export const subscribeToChat = (recipientType, recipientId, callback) => {
  // This would be implemented with WebSocket connection
  // Placeholder for actual WebSocket implementation
  console.log(`Subscribed to ${recipientType} chat ${recipientId}`);
  return () => console.log(`Unsubscribed from ${recipientType} chat ${recipientId}`);
};