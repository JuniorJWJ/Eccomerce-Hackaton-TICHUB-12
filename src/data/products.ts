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
  new Product(6, 'Creatina Monohidratada 300g', 89.9, suplemento, 25),
  new Product(7, 'BCAA 2:1:1 120 caps', 79.9, suplemento, 9),
  new Product(8, 'Pré-treino Night Pump', 99.9, suplemento, 4),
  new Product(9, 'Vitamina D3 2000UI', 39.9, suplemento, 30),
  new Product(10, 'Placa-mãe B550', 899.9, hardware, 6),
  new Product(11, 'SSD NVMe 1TB', 429.9, hardware, 15),
  new Product(12, 'Headset Gamer Pro', 299.9, hardware, 12),
  new Product(13, 'Monitor 27" 165Hz', 1499.9, hardware, 3),
  new Product(14, 'Teclado Mecânico RGB', 249.9, hardware, 10),
  new Product(15, 'Mouse Wireless 16000 DPI', 199.9, hardware, 14),
  new Product(16, 'Jaqueta Corta-vento', 189.9, roupa, 8),
  new Product(17, 'Tênis Treino Lite', 249.9, roupa, 5),
  new Product(18, 'Moletom Oversized', 159.9, roupa, 11),
  new Product(19, 'Bermuda Dry Fit', 79.9, roupa, 16),
  new Product(20, 'Camisa Polo Essential', 89.9, roupa, 13),
]
