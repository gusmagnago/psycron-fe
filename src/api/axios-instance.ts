import axios from 'axios';

const { VITE_PSYCRON_BASE_API_URL, VITE_PSYCRON_API_KEY } = import.meta.env;

const baseURL =
	import.meta.env.MODE === 'development'
		? 'http://localhost:2008/api/v1'
		: VITE_PSYCRON_BASE_API_URL;

const apiClient = axios.create({
	baseURL: baseURL,
	// headers: {
	// 	'Content-Type': 'application/json',
	// },
});

apiClient.interceptors.request.use(
	(config) => {
		config.headers['x-api-key'] = VITE_PSYCRON_API_KEY;
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

export default apiClient;
