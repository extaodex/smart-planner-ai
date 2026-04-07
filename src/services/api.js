import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 8000,
});

// Interceptor to inject Token & AI Config into headers
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('planner_token');
  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const savedSettings = localStorage.getItem('planner_settings');
  if (savedSettings && savedSettings !== 'undefined' && savedSettings !== 'null') {
    try {
      const prefs = JSON.parse(savedSettings);
      if (prefs.aiProvider) config.headers['x-ai-provider'] = prefs.aiProvider;
      if (prefs.apiKey) config.headers['x-api-key'] = prefs.apiKey;
    } catch (e) {
      console.warn("api.js: Corrupt settings in localStorage", e);
    }
  }
  return config;
});

// ─── Auth ─────────────────────────────────────────────────
export const login    = (email, password) => API.post('/auth/login', { email, password });
export const register = (data)            => API.post('/auth/register', data);
export const getMe    = ()                 => API.get('/auth/me');

// ─── Tasks ────────────────────────────────────────────────
export const getTasks    = ()        => API.get('/tasks');
export const createTask  = (data)    => API.post('/tasks', data);
export const toggleTask  = (id)      => API.patch(`/tasks/${id}/toggle`);
export const deleteTask  = (id)      => API.delete(`/tasks/${id}`);

// ─── Courses ──────────────────────────────────────────────
export const getCourses  = ()        => API.get('/courses');
export const createCourse= (data)    => API.post('/courses', data);
export const deleteCourse= (id)      => API.delete(`/courses/${id}`);

// ─── AI ───────────────────────────────────────────────────
export const generatePlan = (tasks, availableHours = 4) =>
  API.post('/ai/plan', { tasks, availableHours });

export const getBestTime  = (subject) =>
  API.post('/ai/best-time', { subject });

export const getAIStats   = ()        => API.get('/ai/stats');

export default API;
