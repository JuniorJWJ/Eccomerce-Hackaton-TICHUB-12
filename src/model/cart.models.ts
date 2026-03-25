import type { CartItem } from '../interfaces/CartItem'
import { Product } from './product.model'

export class Cart {
  private items: CartItem[] = []
  static onChange: (() => void) | null = null

  addItem(product: Product, quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Cart: a quantidade deve ser maior que zero.')
    }

    const productAlreadyInCart = this.items.some((item) => item.product.id === product.id)
    const availableStock = Math.max(0, Math.floor(product.stock))

    if (productAlreadyInCart) {
      this.items = this.items.map((item) => {
        if (item.product.id !== product.id) {
          return item
        }

        if (item.quantity >= availableStock) {
          return item
        }

        return { ...item, quantity: Math.min(item.quantity + quantity, availableStock) }
      })
      return
    }

    const nextQuantity = Math.min(quantity, availableStock)
    if (nextQuantity > 0) {
      this.items.push({ product, quantity: nextQuantity })
    }
    Cart.onChange?.()
  }

  getTotalItems(): number {
    return this.items.reduce((total, item) => total + item.quantity, 0)
  }

  getFinalPrice(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0)
  }

  getItems(): CartItem[] {
    return [...this.items]
  }

  removeOne(product: Product): void {
    const existingItem = this.items.find((item) => item.product.id === product.id)

    if (!existingItem) {
      return
    }

    if (existingItem.quantity <= 1) {
      this.items = this.items.filter((item) => item.product.id !== product.id)
      Cart.onChange?.()
      return
    }

    this.items = this.items.map((item) =>
      item.product.id === product.id ? { ...item, quantity: item.quantity - 1 } : item,
    )
    Cart.onChange?.()
  }

  removeAll(product: Product): void {
    this.items = this.items.filter((item) => item.product.id !== product.id)
    Cart.onChange?.()
  }
}
