import axios from 'axios';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
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


