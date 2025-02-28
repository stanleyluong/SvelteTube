import axios from "axios";

// For debugging environment variables
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('API Key defined:', import.meta.env.VITE_API_KEY ? 'Yes' : 'No');

// Check if API key is available
if (!import.meta.env.VITE_API_KEY) {
  console.error('YouTube API key is missing! Make sure to set VITE_API_KEY in your .env.local file.');
}

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    maxResults: 20,
    key: import.meta.env.VITE_API_KEY,
  },
});

// Add a request interceptor for logging
instance.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

export default instance;