import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach token from localStorage if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth.token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getGroups() {
  const res = await api.get('/groups');
  return res.data;
}

export async function createGroup(group) {
  const res = await api.post('/groups', group);
  return res.data;
}

export async function getGroup(id) {
  const res = await api.get(`/groups/${id}`);
  return res.data;
}

export async function updateGroup(id, payload) {
  const res = await api.put(`/groups/${id}`, payload);
  return res.data;
}

export async function createExpense(expense) {
  const res = await api.post('/expenses', expense);
  return res.data;
}

export async function getSummary(groupId) {
  const res = await api.get(`/summary/${groupId}`);
  return res.data;
}

export async function getSettlements(groupId) {
  const res = await api.get(`/settlements/${groupId}`);
  return res.data;
}

// Invite APIs
export async function generateInviteLink(groupId) {
  const res = await api.post(`/groups/${groupId}/invite`);
  return res.data;
}

export async function lookupInvite(code) {
  // Public; axios still sends token if present
  const res = await api.get(`/groups/invite/${code}`);
  return res.data;
}

export async function joinByInvite(code) {
  const res = await api.post(`/groups/join/${code}`);
  return res.data;
}

export async function registerUser(payload) {
  const res = await api.post(`/auth/register`, payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post(`/auth/login`, payload);
  return res.data;
}

export async function getMe() {
  const res = await api.get(`/auth/me`);
  return res.data;
}


