import { reactive } from '@vue/reactivity'
import { Product } from '../model/product.model'
import { seedProducts } from '../data/products'
import { Category } from '../model/category.model'
import { categoryState } from './categories.store'
import { orderState } from './orders.store'

const STORAGE_KEY = 'loja_products'

const colors = ['%23FBD38D', '%239DD7F7', '%239AE6B4', '%23F8B4B4', '%23C4B5FD']

const legacyImages = new Set([
  'https://mixnutri.fbitsstatic.net/img/p/whey-100-concentrado-chocolate-ice-cream-pote-900g-pronabol-80433/268885-2.jpg?w=674&h=674&v=202512121548',
  'https://cdn.pixabay.com/photo/2022/09/16/13/44/bottle-7458649_1280.jpg',
  'https://cdn.pixabay.com/photo/2021/03/27/05/10/pills-6127501_640.jpg',
  'https://images.unsplash.com/photo-1770932588917-42c0ecd3f210?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  'https://images.unsplash.com/photo-1761896902115-49793a359daf?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  'https://cdn.pixabay.com/photo/2014/09/24/20/36/gaming-459544_1280.jpg',
  'https://images.unsplash.com/photo-1578874763335-4d21bab88a99?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  'https://images.unsplash.com/photo-1770736261634-5f93cb918191?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
])

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

type StoredProduct = {
  id: number
  name: string
  price: number
  categoryId: number
  stock: number
  imageUrl?: string
}

function loadProducts(): Product[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return [...seedProducts]
  }

  try {
    const parsed = JSON.parse(raw) as StoredProduct[]
    const seedById = new Map(seedProducts.map((product) => [product.id, product]))
    return parsed
      .map((item, index) => {
        const category = categoryState.categories.find((cat) => cat.id === item.categoryId)
        if (!category) {
          return null
        }
        const seedImage = seedById.get(item.id)?.imageUrl
        const normalizedImage = item.imageUrl?.trim()
        const shouldReplace = normalizedImage ? legacyImages.has(normalizedImage) : true
        const imageUrl =
          normalizedImage && !normalizedImage.startsWith('data:image/svg') && !shouldReplace
            ? normalizedImage
            : seedImage || createFallbackImage(item.name, index)
        return new Product(
          item.id,
          item.name,
          item.price,
          category,
          item.stock,
          imageUrl,
        )
      })
      .filter((item): item is Product => item !== null)
  } catch {
    return [...seedProducts]
  }
}

function saveProducts(products: Product[]): void {
  const payload: StoredProduct[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: product.price,
    categoryId: product.category.id,
    stock: product.stock,
    imageUrl: product.imageUrl,
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export const productState = reactive({
  products: loadProducts(),
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
  saveProducts(productState.products)
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
  const hasOrders = orderState.orders.some((order) =>
    order.items.some((item) => item.productId === id),
  )
  const safeStock = hasOrders ? Math.min(payload.stock, current.stock) : payload.stock
  const updated = new Product(
    id,
    payload.name,
    payload.price,
    payload.category,
    safeStock,
    payload.imageUrl?.trim() || current.imageUrl || createFallbackImage(payload.name, id),
  )
  productState.products.splice(index, 1, updated)
  saveProducts(productState.products)
  return updated
}

export function reduceStock(items: { productId: number; quantity: number }[]): void {
  if (!items.length) {
    return
  }

  items.forEach((item) => {
    const product = productState.products.find((p) => p.id === item.productId)
    if (!product) {
      return
    }
    product.stock = Math.max(0, product.stock - item.quantity)
  })

  saveProducts(productState.products)
}

export function removeProduct(id: number): boolean {
  const index = productState.products.findIndex((product) => product.id === id)
  if (index === -1) {
    return false
  }

  const product = productState.products[index]
  const hasOrders = orderState.orders.some((order) =>
    order.items.some((item) => item.productId === id),
  )

  if (hasOrders) {
    product.stock = 0
    saveProducts(productState.products)
    return false
  }

  productState.products.splice(index, 1)
  saveProducts(productState.products)
  return true
}
