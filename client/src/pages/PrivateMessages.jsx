import { useState, useEffect } from 'react';
import { getMessages, sendMessage } from '../services/chatService';
import { getUsers } from '../services/authService';

const PrivateMessages = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData.filter(user => user._id !== currentUser._id));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, [currentUser]);

  useEffect(() => {
    if (!selectedUser) return;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const chatMessages = await getMessages('USER', selectedUser._id);
        setMessages(chatMessages);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
      setLoading(false);
    };

    loadMessages();
  }, [selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    try {
      await sendMessage(newMessage, 'USER', selectedUser._id);
      setNewMessage('');
      // Refresh messages
      const chatMessages = await getMessages('USER', selectedUser._id);
      setMessages(chatMessages);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Private Messages</h1>
      
      <div className="flex gap-4">
        {/* User list */}
        <div className="w-1/3 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Players</h2>
          <div className="space-y-2">
            {users.map(user => (
              <div 
                key={user._id}
                className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 ${selectedUser?._id === user._id ? 'bg-blue-100' : ''}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          {selectedUser ? (
            <>
              <div className="border-b pb-2 mb-4">
                <h2 className="text-lg font-semibold">Chat with {selectedUser.username}</h2>
              </div>
              
              <div className="h-96 overflow-y-auto mb-4 space-y-3">
                {loading ? (
                  <p>Loading messages...</p>
                ) : (
                  messages.map(message => (
                    <div 
                      key={message._id}
                      className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs rounded-lg p-3 ${message.sender._id === currentUser._id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                        <p>{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form onSubmit={handleSendMessage} className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border rounded-lg px-4 py-2"
                    placeholder="Type your message..."
                  />
                  <button 
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500">Select a user to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateMessages;