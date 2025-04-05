import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getGuilds, joinGuild, leaveGuild, getGuildDetails, createGuild } from '../services/guildService';
import GuildRoleManager from '../components/GuildRoleManager';

const Guilds = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [guilds, setGuilds] = useState([]);
  const [selectedGuild, setSelectedGuild] = useState(null);
  const [guildDetails, setGuildDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchGuilds = async () => {
      setLoading(true);
      try {
        const guildsData = await getGuilds();
        setGuilds(guildsData);
      } catch (error) {
        console.error('Failed to fetch guilds:', error);
      }
      setLoading(false);
    };
    fetchGuilds();
  }, []);

  const handleGuildSelect = async (guildId) => {
    setLoading(true);
    try {
      const details = await getGuildDetails(guildId);
      setSelectedGuild(guildId);
      setGuildDetails(details);
    } catch (error) {
      console.error('Failed to fetch guild details:', error);
    }
    setLoading(false);
  };

  const handleJoinGuild = async (guildId) => {
    setLoading(true);
    try {
      await joinGuild(guildId);
      await handleGuildSelect(guildId);
    } catch (error) {
      console.error('Failed to join guild:', error);
    }
    setLoading(false);
  };

  const handleLeaveGuild = async (guildId) => {
    setLoading(true);
    try {
      await leaveGuild(guildId);
      setSelectedGuild(null);
      setGuildDetails(null);
    } catch (error) {
      console.error('Failed to leave guild:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex border-b border-gray-200 mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'explore' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('explore')}
        >
          Explore Guilds
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'my-guild' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('my-guild')}
        >
          My Guild
        </button>
        {selectedGuild && (
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'chat' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
            onClick={() => setActiveTab('chat')}
          >
            Guild Chat
          </button>
        )}
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'create' ? 'text-primary border-b-2 border-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('create')}
        >
          Create Guild
        </button>
      </div>

      {activeTab === 'explore' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p>Loading guilds...</p>
          ) : (
            guilds.map(guild => (
              <div key={guild._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-2">{guild.name}</h3>
                <p className="text-gray-600 mb-4">{guild.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {guild.members.length} members
                  </span>
                  <button 
                    className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
                    onClick={() => handleJoinGuild(guild._id)}
                  >
                    Join Guild
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'my-guild' && (
        <>
          {selectedGuild && guildDetails ? (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{guildDetails.name}</h2>
                  <p className="text-gray-600">{guildDetails.description}</p>
                </div>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  onClick={() => handleLeaveGuild(selectedGuild)}
                >
                  Leave Guild
                </button>
              </div>

              <div className="mt-4 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold">Members</h3>
                  <ul className="list-disc pl-5">
                    {guildDetails.members.map(member => (
                      <li key={member._id}>{member.username}</li>
                    ))}
                  </ul>
                </div>
                
                <GuildRoleManager 
                  guildId={selectedGuild}
                  members={guildDetails.members}
                  roles={guildDetails.roles}
                  currentUserRole={
                    guildDetails.roles.find(r => r.userId === guildDetails.leader)?.role || 'MEMBER'
                  }
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">You're not currently in a guild</p>
              <button 
                className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
                onClick={() => setActiveTab('explore')}
              >
                Browse Guilds
              </button>
            </div>
          )}
        </>
      )}

      {activeTab === 'create' && (
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Create New Guild</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const name = formData.get('name');
            const description = formData.get('description');
            
            setLoading(true);
            try {
              await createGuild(name, description);
              setActiveTab('my-guild');
              const guildsData = await getGuilds();
              setGuilds(guildsData);
            } catch (error) {
              console.error('Failed to create guild:', error);
              alert(error.message || 'Failed to create guild');
            }
            setLoading(false);
          }}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Guild Name</label>
              <input 
                type="text" 
                name="name"
                className="w-full px-3 py-2 border rounded"
                placeholder="Enter guild name"
                required
                minLength="3"
                maxLength="30"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea 
                name="description"
                className="w-full px-3 py-2 border rounded"
                rows="3"
                placeholder="Describe your guild"
                required
                maxLength="200"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full py-2 bg-primary text-white rounded hover:bg-blue-700 transition"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Guild'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Guilds;