import { reactive } from '@vue/reactivity'
import { cartState } from './cart.store'
import { authState } from './auth.store'

export type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  userId: number
  items: OrderItem[]
  total: number
  createdAt: string
}

const STORAGE_KEY = 'loja_orders'

function loadOrders(): Order[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

function saveOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export const orderState = reactive({
  orders: loadOrders(),
})

export function createOrder(): Order | null {
  const userId = authState.user?.id
  if (!userId) {
    return null
  }

  const items = cartState.cart.getItems().map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
  }))

  if (!items.length) {
    return null
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    items,
    total,
    createdAt: new Date().toISOString(),
  }

  orderState.orders.unshift(order)
  saveOrders(orderState.orders)
  return order
}

export function getOrdersByUser(userId: number): Order[] {
  return orderState.orders.filter((order) => order.userId === userId)
}
