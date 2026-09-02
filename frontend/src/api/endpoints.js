import api from './axios';


export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const fetchMe = () => api.get('/auth/me');


export const fetchCategories = () => api.get('/categories');


export const fetchTransactions = (params) => api.get('/transactions', { params });
export const fetchTransaction = (id) => api.get(`/transactions/${id}`);
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (id, data) => api.put(`/transactions/${id}`, data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);


export const fetchBudgets = (params) => api.get('/budgets', { params });
export const setBudget = (data) => api.post('/budgets', data);
export const deleteBudget = (id) => api.delete(`/budgets/${id}`);


export const fetchSummary = () => api.get('/dashboard/summary');
export const fetchChartData = (params) => api.get('/dashboard/charts', { params });
export const fetchAnalytics = () => api.get('/dashboard/analytics');


export const exportCSVUrl = () => `${api.defaults.baseURL}/export/csv`;
export const exportPDFUrl = () => `${api.defaults.baseURL}/export/pdf`;
