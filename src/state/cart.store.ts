import { reactive } from '@vue/reactivity'
import { Cart } from '../model/cart.models'
import { getProductById } from './products.store'
import { Product } from '../model/product.model'

const STORAGE_KEY = 'loja_cart'

function loadCart(): Cart {
  const cart = new Cart()
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return cart
  }

  try {
    const parsed = JSON.parse(raw) as { items: { productId: number; quantity: number }[] }
    parsed.items.forEach((item) => {
      const product = getProductById(item.productId) as Product | undefined
      if (product) {
        cart.addItem(product, item.quantity)
      }
    })
  } catch {
    return cart
  }

  return cart
}

function saveCart(cart: Cart): void {
  const items = cart.getItems().map((item) => ({
    productId: item.product.id,
    quantity: item.quantity,
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items }))
}

export const cartState = reactive({
  cart: loadCart(),
})

Cart.onChange = () => {
  saveCart(cartState.cart)
}

export function clearCart(): void {
  cartState.cart.clear()
  saveCart(cartState.cart)
}
