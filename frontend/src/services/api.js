const BASE_URL = 'https://projeto3-estoque-backend.onrender.com/api'

const DEFAULT_TIMEOUT = 15000 // 15s

async function parseBody(res) {
  const text = await res.text()

  try {
    return text ? JSON.parse(text) : null
  } catch {
    return text
  }
}

function getAuthToken() {
  try {
    return localStorage.getItem('auth_token')
  } catch {
    return null
  }
}

async function fetchWithTimeout(url, options = {}, timeout = DEFAULT_TIMEOUT) {
  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), timeout)

  try {
    const token = getAuthToken()
    const headers = { ...(options.headers || {}) }
    if (token) headers['Authorization'] = `Bearer ${token}`

    const res = await fetch(url, { ...options, headers, signal: controller.signal })
    clearTimeout(id)
    return res
  } catch (err) {
    clearTimeout(id)
    if (err.name === 'AbortError') {
      throw new Error('Tempo limite de requisição atingido.')
    }
    throw err
  }
}

export async function get(path) {
  const res = await fetchWithTimeout(`${BASE_URL}${path}`)

  const data = await parseBody(res)

  if (!res.ok) {
    throw new Error(
      data?.message || `GET ${path} falhou (${res.status})`
    )
  }

  return data
}

export async function post(path, body) {
  console.log('POST:', `${BASE_URL}${path}`, body)

  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await parseBody(res)

  console.log('Resposta POST:', res.status, data)

  if (!res.ok) {
    throw new Error(
      data?.message || `POST ${path} falhou (${res.status})`
    )
  }

  return data
}

export async function put(path, body) {
  console.log('PUT:', `${BASE_URL}${path}`)

  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const data = await parseBody(res)

  console.log('Resposta PUT:', res.status, data)

  if (!res.ok) {
    throw new Error(
      data?.message || `PUT ${path} falhou (${res.status})`
    )
  }

  return data
}

export async function del(path) {
  const res = await fetchWithTimeout(`${BASE_URL}${path}`, {
    method: 'DELETE',
  })

  const data = await parseBody(res)

  if (!res.ok) {
    throw new Error(
      data?.message || `DELETE ${path} falhou (${res.status})`
    )
  }

  return data
}