import axios from 'axios';
const api = axios.create({ baseURL: 'https://sistemaagely.com.br:8345' });
export default api;