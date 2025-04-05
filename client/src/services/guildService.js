import api from './api';

export const createGuild = async (name, description) => {
  try {
    const response = await api.post('/guilds', { name, description });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create guild' };
  }
};

export const getGuilds = async () => {
  try {
    const response = await api.get('/guilds');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch guilds' };
  }
};

export const joinGuild = async (guildId) => {
  try {
    const response = await api.post(`/guilds/${guildId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to join guild' };
  }
};

export const leaveGuild = async (guildId) => {
  try {
    const response = await api.post(`/guilds/${guildId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to leave guild' };
  }
};

export const getGuildDetails = async (guildId) => {
  try {
    const response = await api.get(`/guilds/${guildId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch guild details' };
  }
};

export const assignRole = async (guildId, userId, role) => {
  try {
    const response = await api.post(`/guilds/${guildId}/roles`, { userId, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to assign role' };
  }
};

export const removeRole = async (guildId, userId) => {
  try {
    const response = await api.delete(`/guilds/${guildId}/roles/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove role' };
  }
};
