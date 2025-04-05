import { useEffect, useState } from 'react';
import { getLeaderboard, getMyRank } from '../services/leaderboardService';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [myRank, setMyRank] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leaderboardData, myRankData] = await Promise.all([
          getLeaderboard(),
          getMyRank()
        ]);
        setLeaderboard(leaderboardData);
        setMyRank(myRankData);
      } catch (error) {
        console.error('Failed to load leaderboard:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading leaderboard...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      
      {myRank && (
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold mb-2">Your Rank</h2>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold mr-2">#{myRank.rank}</span>
              <span className="text-lg">{myRank.user.username}</span>
            </div>
            <div className="text-lg font-semibold">
              Score: {myRank.score}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">W/L</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leaderboard.map((entry, index) => (
              <tr key={entry._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                      {entry.user.avatar ? (
                        <img className="h-10 w-10 rounded-full" src={entry.user.avatar} alt="" />
                      ) : (
                        <span className="text-gray-600">{entry.user.username.charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{entry.user.username}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{entry.score}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {entry.wins}W / {entry.losses}L
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;