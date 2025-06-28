import axios from 'axios';

const API_URL = 'http://localhost:3001/auth'; // Asegúrate de que coincida con tu backend

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (userData: {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};