const API_BASE_URL = 'https://projeto3-estoque-backend.onrender.com/api';

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`GET ${path} falhou (${response.status})`);
  }

  return response.json();
}

export { API_BASE_URL };
