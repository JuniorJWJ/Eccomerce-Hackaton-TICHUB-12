import { Product } from '../model/product.model'
import { categories } from './categories'

const suplemento = categories.find((category) => category.id === 1)!
const hardware = categories.find((category) => category.id === 2)!
const roupa = categories.find((category) => category.id === 3)!

export const seedProducts: Product[] = [
  new Product(1, 'Whey black skull 100%', 69.9, suplemento, 12),
  new Product(2, 'RTX 3080', 4000, hardware, 2),
  new Product(3, 'Camiseta 100% algodão', 59.9, roupa, 0),
  new Product(4, 'Calça jeans', 99.9, roupa, 7),
  new Product(5, 'Maca Peruana', 20, suplemento, 18),
]
