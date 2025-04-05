import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const QuestBoard = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [quests, setQuests] = useState([
    {
      id: 1,
      title: 'Dragon Slaying',
      type: 'adventure',
      reward: 1000,
      participants: 8,
      featured: true,
      description: 'Defeat the ancient dragon terrorizing the village'
    },
    {
      id: 2,
      title: 'Hackathon Challenge',
      type: 'hackathon',
      reward: 500,
      participants: 12,
      featured: false,
      description: 'Build an innovative web application in 48 hours'
    },
    {
      id: 3,
      title: 'UI Design Challenge',
      type: 'design',
      reward: 300,
      participants: 5,
      featured: true,
      description: 'Create stunning UI designs for our new feature'
    }
  ]);

  const filteredQuests = activeFilter === 'all' 
    ? quests 
    : quests.filter(quest => quest.type === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Quest Board</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveFilter('all')}
        >
          All Quests
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'adventure' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveFilter('adventure')}
        >
          Adventure
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'hackathon' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveFilter('hackathon')}
        >
          Hackathons
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'design' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveFilter('design')}
        >
          Design
        </button>
        <button
          className={`px-4 py-2 rounded-full ${activeFilter === 'finance' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setActiveFilter('finance')}
        >
          Finance
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuests.map(quest => (
          <div key={quest.id} className={`bg-white rounded-lg shadow overflow-hidden ${quest.featured ? 'border-2 border-yellow-400' : ''}`}>
            {quest.featured && (
              <div className="bg-yellow-400 text-center py-1 text-sm font-bold">
                Featured Quest
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">{quest.title}</h3>
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                  {quest.type}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{quest.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-primary font-bold">${quest.reward}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {quest.participants} participants
                  </span>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-700 transition">
                  {quest.featured ? 'Join ($5)' : 'Join Free'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestBoard;