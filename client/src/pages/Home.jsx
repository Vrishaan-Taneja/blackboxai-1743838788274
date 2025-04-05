import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-6">
          Adventure Game Platform
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Join guilds, complete quests, and climb the leaderboards!
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/auth"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
          <Link
            to="/quests"
            className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-blue-50 transition"
          >
            Browse Quests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;