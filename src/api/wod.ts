import { api } from './axios';

export type CreateWodPayload = {
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
};

export const createWod = async (payload: CreateWodPayload) => {
  const res = await api.post('/wod', payload);
  return res.data;
};
