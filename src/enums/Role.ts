export const Role = {
  ADMIN: 'ADMIN',
  CUSTOMER: 'CUSTOMER',
} as const

export type Role = (typeof Role)[keyof typeof Role]
