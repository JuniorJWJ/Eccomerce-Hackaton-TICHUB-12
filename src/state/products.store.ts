import { reactive } from '@vue/reactivity'
import { Product } from '../model/product.model'
import { seedProducts } from '../data/products'
import { Category } from '../model/category.model'

const colors = ['%23FBD38D', '%239DD7F7', '%239AE6B4', '%23F8B4B4', '%23C4B5FD']

function createFallbackImage(name: string, seed = 0): string {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const color = colors[seed % colors.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="320" height="220" rx="24" fill="${color}"/><text x="50%" y="54%" font-size="64" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="700">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

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
  imageUrl?: string
}): Product {
  const newProduct = new Product(
    getNextProductId(),
    payload.name,
    payload.price,
    payload.category,
    payload.stock,
    payload.imageUrl?.trim() || createFallbackImage(payload.name, productState.products.length),
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
    imageUrl?: string
  },
): Product | undefined {
  const index = productState.products.findIndex((product) => product.id === id)

  if (index === -1) {
    return undefined
  }

  const current = productState.products[index]
  const updated = new Product(
    id,
    payload.name,
    payload.price,
    payload.category,
    payload.stock,
    payload.imageUrl?.trim() || current.imageUrl || createFallbackImage(payload.name, id),
  )
  productState.products.splice(index, 1, updated)
  return updated
}
