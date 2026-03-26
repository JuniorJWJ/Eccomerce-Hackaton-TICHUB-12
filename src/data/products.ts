import { Product } from '../model/product.model'
import { categories } from './categories'

const suplemento = categories.find((category) => category.id === 1)!
const hardware = categories.find((category) => category.id === 2)!
const roupa = categories.find((category) => category.id === 3)!

const images = {
  supplementBottle: 'https://cdn.pixabay.com/photo/2022/09/16/13/44/bottle-7458649_1280.jpg',
  pills: 'https://cdn.pixabay.com/photo/2021/03/27/05/10/pills-6127501_640.jpg',
  gpu: 'https://images.unsplash.com/photo-1770932588917-42c0ecd3f210?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  clothing: 'https://images.unsplash.com/photo-1761896902115-49793a359daf?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  gamingSetup: 'https://cdn.pixabay.com/photo/2014/09/24/20/36/gaming-459544_1280.jpg',
  hoodie: 'https://images.unsplash.com/photo-1578874763335-4d21bab88a99?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
  sneakers: 'https://images.unsplash.com/photo-1770736261634-5f93cb918191?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000',
}

export const seedProducts: Product[] = [
  new Product(1, 'Whey black skull 100%', 69.9, suplemento, 12, images.supplementBottle),
  new Product(2, 'RTX 3080', 4000, hardware, 2, images.gpu),
  new Product(3, 'Camiseta 100% algodão', 59.9, roupa, 0, images.clothing),
  new Product(4, 'Calça jeans', 99.9, roupa, 7, images.clothing),
  new Product(5, 'Maca Peruana', 20, suplemento, 18, images.pills),
  new Product(6, 'Creatina Monohidratada 300g', 89.9, suplemento, 25, images.supplementBottle),
  new Product(7, 'BCAA 2:1:1 120 caps', 79.9, suplemento, 9, images.supplementBottle),
  new Product(8, 'Pré-treino Night Pump', 99.9, suplemento, 4, images.supplementBottle),
  new Product(9, 'Vitamina D3 2000UI', 39.9, suplemento, 30, images.pills),
  new Product(10, 'Placa-mãe B550', 899.9, hardware, 6, images.gamingSetup),
  new Product(11, 'SSD NVMe 1TB', 429.9, hardware, 15, images.gamingSetup),
  new Product(12, 'Headset Gamer Pro', 299.9, hardware, 12, images.gamingSetup),
  new Product(13, 'Monitor 27" 165Hz', 1499.9, hardware, 3, images.gamingSetup),
  new Product(14, 'Teclado Mecânico RGB', 249.9, hardware, 10, images.gamingSetup),
  new Product(15, 'Mouse Wireless 16000 DPI', 199.9, hardware, 14, images.gamingSetup),
  new Product(16, 'Jaqueta Corta-vento', 189.9, roupa, 8, images.hoodie),
  new Product(17, 'Tênis Treino Lite', 249.9, roupa, 5, images.sneakers),
  new Product(18, 'Moletom Oversized', 159.9, roupa, 11, images.hoodie),
  new Product(19, 'Bermuda Dry Fit', 79.9, roupa, 16, images.clothing),
  new Product(20, 'Camisa Polo Essential', 89.9, roupa, 13, images.clothing),
]
