import axios from 'axios';

const API_URL = 'http://localhost:3000/auth'; // Asegúrate de que coincida con tu backend

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const saveToken = (token: string) => {
  localStorage.setItem('token', token);
};

export const saveSession = (token: string, user: any) => {
    console.log("Guardando sesión con usuario:", user); // <-- Agregado

  localStorage.setItem('token', token);
  localStorage.setItem('name', JSON.stringify(user));
};

export const getToken = () => localStorage.getItem('token');

export const getUser = () => {
  const user = localStorage.getItem('name');
  return user ? JSON.parse(user) : null;
};

export const removeSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
};


export const removeToken = () => {
  localStorage.removeItem('token');
};

