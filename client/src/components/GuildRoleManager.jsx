import { useState } from 'react';
import { assignRole, removeRole } from '../services/guildService';

const GuildRoleManager = ({ guildId, members, roles, currentUserRole }) => {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedRole, setSelectedRole] = useState('MEMBER');

  const handleAssignRole = async () => {
    if (!selectedMember) return;
    try {
      await assignRole(guildId, selectedMember, selectedRole);
      alert('Role assigned successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  const handleRemoveRole = async (userId) => {
    try {
      await removeRole(guildId, userId);
      alert('Role removed successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Role Management</h2>
      
      {currentUserRole === 'LEADER' ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <select
              className="border rounded p-2 flex-1"
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
            >
              <option value="">Select Member</option>
              {members.map(member => (
                <option key={member._id} value={member._id}>
                  {member.username}
                </option>
              ))}
            </select>
            
            <select
              className="border rounded p-2"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
            
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleAssignRole}
            >
              Assign
            </button>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Current Roles</h3>
            {roles.map(({ userId, role }) => (
              <div key={userId} className="flex justify-between items-center">
                <span>
                  {members.find(m => m._id === userId)?.username || 'Unknown'} - {role}
                </span>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleRemoveRole(userId)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Only guild leaders can manage roles</p>
      )}
    </div>
  );
};

export default GuildRoleManager;