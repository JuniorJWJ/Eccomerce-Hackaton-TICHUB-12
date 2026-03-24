import { reactive } from '@vue/reactivity'
import { Product } from '../model/product.model'
import { seedProducts } from '../data/products'
import { Category } from '../model/category.model'

export const productState = reactive({
  products: [...seedProducts],
})

export function getProductById(id: number): Product | undefined {
  return productState.products.find((product) => product.id === id)
}

export function getNextProductId(): number {
  const ids = productState.products.map((product) => product.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

export function addProduct(payload: {
  name: string
  price: number
  category: Category
  stock: number
}): Product {
  const newProduct = new Product(
    getNextProductId(),
    payload.name,
    payload.price,
    payload.category,
    payload.stock,
  )

  productState.products.push(newProduct)
  return newProduct
}

export function updateProduct(
  id: number,
  payload: {
    name: string
    price: number
    category: Category
    stock: number
  },
): Product | undefined {
  const index = productState.products.findIndex((product) => product.id === id)

  if (index === -1) {
    return undefined
  }

  const updated = new Product(id, payload.name, payload.price, payload.category, payload.stock)
  productState.products.splice(index, 1, updated)
  return updated
}
