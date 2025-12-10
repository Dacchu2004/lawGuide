
import axios from 'axios';

const API_URL = "http://127.0.0.1:5000";

export const subscribeNewsletter = async (email: string) => {
  const response = await axios.post(`${API_URL}/newsletter/subscribe`, { email });
  return response.data;
};
