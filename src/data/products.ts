import { Product } from '../model/product.model'
import { categories } from './categories'

const suplemento = categories.find((category) => category.id === 1)!
const hardware = categories.find((category) => category.id === 2)!
const roupa = categories.find((category) => category.id === 3)!

const colors = ['%23FBD38D', '%239DD7F7', '%239AE6B4', '%23F8B4B4', '%23C4B5FD']

const createProductImage = (name: string, index: number): string => {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
  const color = colors[index % colors.length]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="220"><rect width="320" height="220" rx="24" fill="${color}"/><text x="50%" y="54%" font-size="64" text-anchor="middle" fill="white" font-family="Arial, sans-serif" font-weight="700">${initials}</text></svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

export const seedProducts: Product[] = [
  new Product(1, 'Whey black skull 100%', 69.9, suplemento, 12, createProductImage('Whey black skull 100%', 0)),
  new Product(2, 'RTX 3080', 4000, hardware, 2, createProductImage('RTX 3080', 1)),
  new Product(3, 'Camiseta 100% algodão', 59.9, roupa, 0, createProductImage('Camiseta 100% algodão', 2)),
  new Product(4, 'Calça jeans', 99.9, roupa, 7, createProductImage('Calça jeans', 3)),
  new Product(5, 'Maca Peruana', 20, suplemento, 18, createProductImage('Maca Peruana', 4)),
  new Product(6, 'Creatina Monohidratada 300g', 89.9, suplemento, 25, createProductImage('Creatina Monohidratada 300g', 5)),
  new Product(7, 'BCAA 2:1:1 120 caps', 79.9, suplemento, 9, createProductImage('BCAA 2:1:1 120 caps', 6)),
  new Product(8, 'Pré-treino Night Pump', 99.9, suplemento, 4, createProductImage('Pré-treino Night Pump', 7)),
  new Product(9, 'Vitamina D3 2000UI', 39.9, suplemento, 30, createProductImage('Vitamina D3 2000UI', 8)),
  new Product(10, 'Placa-mãe B550', 899.9, hardware, 6, createProductImage('Placa-mãe B550', 9)),
  new Product(11, 'SSD NVMe 1TB', 429.9, hardware, 15, createProductImage('SSD NVMe 1TB', 10)),
  new Product(12, 'Headset Gamer Pro', 299.9, hardware, 12, createProductImage('Headset Gamer Pro', 11)),
  new Product(13, 'Monitor 27" 165Hz', 1499.9, hardware, 3, createProductImage('Monitor 27" 165Hz', 12)),
  new Product(14, 'Teclado Mecânico RGB', 249.9, hardware, 10, createProductImage('Teclado Mecânico RGB', 13)),
  new Product(15, 'Mouse Wireless 16000 DPI', 199.9, hardware, 14, createProductImage('Mouse Wireless 16000 DPI', 14)),
  new Product(16, 'Jaqueta Corta-vento', 189.9, roupa, 8, createProductImage('Jaqueta Corta-vento', 15)),
  new Product(17, 'Tênis Treino Lite', 249.9, roupa, 5, createProductImage('Tênis Treino Lite', 16)),
  new Product(18, 'Moletom Oversized', 159.9, roupa, 11, createProductImage('Moletom Oversized', 17)),
  new Product(19, 'Bermuda Dry Fit', 79.9, roupa, 16, createProductImage('Bermuda Dry Fit', 18)),
  new Product(20, 'Camisa Polo Essential', 89.9, roupa, 13, createProductImage('Camisa Polo Essential', 19)),
]
