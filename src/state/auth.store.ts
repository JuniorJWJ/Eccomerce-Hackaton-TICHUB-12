import { reactive } from '@vue/reactivity'
import { Role } from '../enums/Role'

export type User = {
  id: number
  name: string
  email: string
  password: string
  role: Role
}

export type Profile = {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
  photoUrl: string
}

const STORAGE_KEY = 'loja_auth'

const users = reactive<User[]>([
  {
    id: 1,
    name: 'Admin Geral',
    email: 'admin@loja.com',
    password: 'admin123',
    role: Role.ADMIN,
  },
  {
    id: 2,
    name: 'Cliente Demo',
    email: 'cliente@loja.com',
    password: 'cliente123',
    role: Role.CUSTOMER,
  },
])

const emptyProfile: Profile = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  photoUrl: '',
}

type StoredAuth = {
  isAuthenticated: boolean
  role: Role
  user: { id: number; name: string; email: string; role: Role } | null
  profile: Profile
}

function loadAuth(): StoredAuth {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return {
      isAuthenticated: false,
      role: Role.CUSTOMER,
      user: null,
      profile: { ...emptyProfile },
    }
  }

  try {
    const parsed = JSON.parse(raw) as StoredAuth
    return {
      isAuthenticated: parsed.isAuthenticated ?? false,
      role: parsed.role ?? Role.CUSTOMER,
      user: parsed.user ?? null,
      profile: parsed.profile ?? { ...emptyProfile },
    }
  } catch {
    return {
      isAuthenticated: false,
      role: Role.CUSTOMER,
      user: null,
      profile: { ...emptyProfile },
    }
  }
}

function saveAuth(state: typeof authState): void {
  const payload: StoredAuth = {
    isAuthenticated: state.isAuthenticated,
    role: state.role,
    user: state.user
      ? { id: state.user.id, name: state.user.name, email: state.user.email, role: state.user.role }
      : null,
    profile: state.profile,
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

const loaded = loadAuth()

export const authState = reactive({
  isAuthenticated: loaded.isAuthenticated,
  role: loaded.role,
  user: loaded.user as User | null,
  profile: loaded.profile ?? { ...emptyProfile },
})

export function getMockUsers(): User[] {
  return [...users]
}

function syncProfileFromUser(user: User): void {
  authState.profile = {
    ...authState.profile,
    name: user.name,
    email: user.email,
  }
}

export function loginWithCredentials(email: string, password: string): {
  ok: boolean
  message?: string
} {
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password,
  )

  if (!user) {
    return { ok: false, message: 'E-mail ou senha inválidos.' }
  }

  authState.isAuthenticated = true
  authState.role = user.role
  authState.user = user
  syncProfileFromUser(user)
  saveAuth(authState)
  return { ok: true }
}

export function registerUser(payload: {
  name: string
  email: string
  password: string
}): {
  ok: boolean
  message?: string
} {
  const normalizedEmail = payload.email.trim().toLowerCase()

  if (!payload.name.trim()) {
    return { ok: false, message: 'Informe seu nome completo.' }
  }

  if (!normalizedEmail) {
    return { ok: false, message: 'Informe um e-mail válido.' }
  }

  if (payload.password.length < 6) {
    return { ok: false, message: 'A senha precisa ter pelo menos 6 caracteres.' }
  }

  const existingUser = users.some((item) => item.email.toLowerCase() === normalizedEmail)
  if (existingUser) {
    return { ok: false, message: 'Este e-mail já está cadastrado.' }
  }

  const newUser: User = {
    id: users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1,
    name: payload.name.trim(),
    email: normalizedEmail,
    password: payload.password,
    role: Role.CUSTOMER,
  }

  users.push(newUser)
  authState.isAuthenticated = true
  authState.role = newUser.role
  authState.user = newUser
  authState.profile = {
    ...emptyProfile,
    name: newUser.name,
    email: newUser.email,
  }
  saveAuth(authState)

  return { ok: true }
}

export function updateProfile(payload: Partial<Profile>): void {
  authState.profile = {
    ...authState.profile,
    ...payload,
  }
  saveAuth(authState)
}

export function logout(): void {
  authState.isAuthenticated = false
  authState.role = Role.CUSTOMER
  authState.user = null
  authState.profile = { ...emptyProfile }
  saveAuth(authState)
}
