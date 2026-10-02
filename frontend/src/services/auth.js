import { post } from './api'

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export async function login(email, senha) {
  const res = await post('/auth/login', { email, senha })
  if (res?.token) {
    try {
      localStorage.setItem(TOKEN_KEY, res.token)
      localStorage.setItem(USER_KEY, JSON.stringify(res.user))
    } catch {}
  }
  return res
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {}
}

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY) } catch { return null }
}

export function getUser() {
  try { return JSON.parse(localStorage.getItem(USER_KEY)) } catch { return null }
}

export function isAuthenticated() {
  return !!getToken()
}
