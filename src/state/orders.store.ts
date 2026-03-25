import { reactive } from '@vue/reactivity'
import { cartState } from './cart.store'
import { authState } from './auth.store'
import { reduceStock } from './products.store'

export type OrderItem = {
  productId: number
  name: string
  price: number
  quantity: number
  status: OrderStatus
}

export type OrderStatus = 'confirmed' | 'separacao' | 'enviado'

export type Order = {
  id: string
  userId: number
  items: OrderItem[]
  totalBefore: number
  totalAfter: number
  discountCode?: string
  discountPercent?: number
  status: OrderStatus
  statusHistory: { status: OrderStatus; at: string }[]
  createdAt: string
}

const STORAGE_KEY = 'loja_orders'

function loadOrders(): Order[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as Order[]
    return parsed.map((order) => ({
      ...order,
      status: order.status ?? 'confirmed',
      statusHistory:
        order.statusHistory && order.statusHistory.length
          ? order.statusHistory
          : [{ status: order.status ?? 'confirmed', at: order.createdAt ?? new Date().toISOString() }],
      items: (order.items ?? []).map((item) => ({
        ...item,
        status: item.status ?? (order.status ?? 'confirmed'),
      })),
      totalBefore: order.totalBefore ?? order.totalAfter ?? order.totalBefore ?? 0,
      totalAfter: order.totalAfter ?? order.totalBefore ?? 0,
    }))
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

export function createOrder(payload?: {
  discountCode?: string
  discountPercent?: number
  totalAfter?: number
}): Order | null {
  const userId = authState.user?.id
  if (!userId) {
    return null
  }

  const items = cartState.cart.getItems().map((item) => ({
    productId: item.product.id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    status: 'confirmed' as OrderStatus,
  }))

  if (!items.length) {
    return null
  }

  const totalBefore = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalAfter = payload?.totalAfter ?? totalBefore
  const order: Order = {
    id: `ORD-${Date.now()}`,
    userId,
    items,
    totalBefore,
    totalAfter,
    discountCode: payload?.discountCode,
    discountPercent: payload?.discountPercent,
    status: 'confirmed',
    statusHistory: [{ status: 'confirmed', at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  }

  orderState.orders.unshift(order)
  saveOrders(orderState.orders)

  reduceStock(items.map((item) => ({ productId: item.productId, quantity: item.quantity })))

  return order
}

export function updateOrderStatus(orderId: string, status: OrderStatus): void {
  const order = orderState.orders.find((item) => item.id === orderId)
  if (!order) {
    return
  }

  order.status = status
  order.statusHistory.push({ status, at: new Date().toISOString() })
  order.items = order.items.map((item) => ({ ...item, status }))
  saveOrders(orderState.orders)
}

export function getOrdersByUser(userId: number): Order[] {
  return orderState.orders.filter((order) => order.userId === userId)
}
