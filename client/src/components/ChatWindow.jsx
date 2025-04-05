import { useState, useEffect, useRef } from 'react';
import { getMessages, sendMessage, subscribeToChat } from '../services/chatService';

const ChatWindow = ({ recipientType, recipientId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const chatMessages = await getMessages(recipientType, recipientId);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    loadMessages();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToChat(recipientType, recipientId, (message) => {
      setMessages(prev => [...prev, message]);
    });

    return () => unsubscribe();
  }, [recipientType, recipientId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage, recipientType, recipientId);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((message) => (
          <div 
            key={message._id} 
            className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs md:max-w-md rounded-lg p-3 ${message.sender._id === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              <p className="font-semibold">{message.sender.username}</p>
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button 
            type="submit"
            className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600 transition"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;