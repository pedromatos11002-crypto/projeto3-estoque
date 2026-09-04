const BASE_URL = 'https://projeto3-estoque-backend.onrender.com/api';

async function parseBody(res) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : null;
  } catch (e) {
    return text;
  }
}

export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`);
  const data = await parseBody(res);
  if (!res.ok) throw new Error(data?.message || `GET ${path} failed (${res.status})`);
  return data;
}

export async function post(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await parseBody(res);
  if (!res.ok) throw new Error(data?.message || `POST ${path} failed (${res.status})`);
  return data;
}

export async function put(path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await parseBody(res);
  if (!res.ok) throw new Error(data?.message || `PUT ${path} failed (${res.status})`);
  return data;
}

export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'DELETE' });
  if (!res.ok) {
    const data = await parseBody(res);
    throw new Error(data?.message || `DELETE ${path} failed (${res.status})`);
  }
}
