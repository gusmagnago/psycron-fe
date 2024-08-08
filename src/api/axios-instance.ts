import axios from 'axios';

const { VITE_PSYCRON_BASE_API_URL } = import.meta.env;

const baseURL =
	import.meta.env.MODE === 'development'
		? 'http://localhost:2008/api/v1'
		: VITE_PSYCRON_BASE_API_URL;

const apiClient = axios.create({
	baseURL: baseURL,
});

apiClient.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;
