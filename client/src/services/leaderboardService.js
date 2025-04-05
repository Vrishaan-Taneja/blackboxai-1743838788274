import api from './api';

export const getLeaderboard = async () => {
  try {
    const response = await api.get('/leaderboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch leaderboard' };
  }
};

export const getMyRank = async () => {
  try {
    const response = await api.get('/leaderboard/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch rank' };
  }
};