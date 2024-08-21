import axios from 'axios';

const apiClient = axios.create({
	baseURL: import.meta.env.VITE_PSYCRON_BASE_API_URL,
	headers: { 'Content-Type': 'application/json' },
	withCredentials: true,
});

apiClient.interceptors.response.use(
	(response) => response,
	(error) => {
		const errorMessage =
			error.response?.data?.message || 'Unknown error occurred';
		const statusCode = error.response?.status || 500;
		return Promise.reject({ message: errorMessage, statusCode });
	}
);

export default apiClient;
