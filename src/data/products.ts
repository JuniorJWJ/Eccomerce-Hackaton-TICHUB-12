import { Product } from '../model/product.model'
import { categories } from './categories'

const suplemento = categories.find((category) => category.id === 1)!
const hardware = categories.find((category) => category.id === 2)!
const roupa = categories.find((category) => category.id === 3)!

const images = {
  whey: 'https://emporioquatroestrelas.vteximg.com.br/arquivos/ids/228901-1000-1000/WHEY-100---COOKIES-CREAMHD-REFIL-BLACK-SKULL.jpg?v=638497378662630000',
  rtx: 'https://dlcdnwebimgs.asus.com/gain/6c057211-2594-4c90-908e-d782541eb04a/',
  tshirt:
    'https://cdn.awsli.com.br/600x1000/24/24730/produto/315445328/stb24mc131---camiseta-stb-b-sica-tencel---01-dx576hit23.png',
  jeans:
    'https://images.tcdn.com.br/img/img_prod/680926/calca_baw_jeans_baggy_roller_denim_21300_2_fcb4dd3e3f30a7eac7a68c7aba4920a3.png',
  maca: 'https://product-data.raiadrogasil.io/images/14761927.webp',
  creatine:
    'https://www.gsuplementos.com.br/upload/produto/imagem/creatina-monohidratada-250g-growth-supplements.jpg',
  bcaa: 'https://product-data.raiadrogasil.io/images/3710970.webp',
  preworkout:
    'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/opn/opn05296/y/37.jpg',
  vitamin:
    'https://images.tcdn.com.br/img/img_prod/1304890/vitamina_c_60_capsulas_1055_1_ace6f15c0ed1c78edc7b783763839f98.png',
  motherboard:
    'https://static.gigabyte.com/StaticFile/Image/Global/0af763a2c9b64ca5066b79cae95168c6/Product/42932',
  ssd: 'https://m.media-amazon.com/images/I/51OHIGS4wtL._AC_UF894,1000_QL80_.jpg',
  headset:
    'https://images.kabum.com.br/produtos/fotos/508106/headset-gamer-redragon-zeus-pro-preto-h510-pro_1700743328_original.jpg',
  monitor: 'https://picsum.photos/seed/monitor/800/600',
  keyboard:
    'https://images.kabum.com.br/produtos/fotos/472044/teclado-mecanico-gamer-kbm-gaming-tg600-preto-60-e-abnt2-rgb-switch-gateron-blue-kgtg600ptaz_1709825263_gg.jpg',
  mouse:
    'https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/9/1/910-0073014.jpg',
  windbreaker:
    'https://mcdbrasil.vtexassets.com/arquivos/ids/212563/Jaqueta-Windbreaker-Recorte-Bronze-1.jpg?v=638210652266230000',
  sneakers:
    'https://acdn-us.mitiendanube.com/stores/002/194/917/products/img_5539-44f94cb4ff606f01e317337858458823-1024-1024.webp',
  hoodie:
    'https://hourscollection.com/cdn/shop/files/DropShoulderHoodie-Grey-productphoto_1.png?v=1762197948',
  shorts:
    'https://hiatto.cdn.magazord.com.br/img/2024/12/produto/15013/06m0040-shorts-masculino-dry-fit-hiatto-marinho-2.png?ims=630x945',
  polo: 'https://poloplay.vtexassets.com/arquivos/ids/258890-500-auto?v=639100390514500000&width=500&height=auto&aspect=true',
}

export const seedProducts: Product[] = [
  new Product(1, 'Whey black skull 100%', 69.9, suplemento, 12, images.whey),
  new Product(2, 'RTX 3080', 4000, hardware, 2, images.rtx),
  new Product(3, 'Camiseta 100% algodão', 59.9, roupa, 0, images.tshirt),
  new Product(4, 'Calça jeans', 99.9, roupa, 7, images.jeans),
  new Product(5, 'Maca Peruana', 20, suplemento, 18, images.maca),
  new Product(6, 'Creatina Monohidratada 300g', 89.9, suplemento, 25, images.creatine),
  new Product(7, 'BCAA 2:1:1 120 caps', 79.9, suplemento, 9, images.bcaa),
  new Product(8, 'Pré-treino Night Pump', 99.9, suplemento, 4, images.preworkout),
  new Product(9, 'Vitamina D3 2000UI', 39.9, suplemento, 30, images.vitamin),
  new Product(10, 'Placa-mãe B550', 899.9, hardware, 6, images.motherboard),
  new Product(11, 'SSD NVMe 1TB', 429.9, hardware, 15, images.ssd),
  new Product(12, 'Headset Gamer Pro', 299.9, hardware, 12, images.headset),
  new Product(13, 'Monitor 27" 165Hz', 1499.9, hardware, 3, images.monitor),
  new Product(14, 'Teclado Mecânico RGB', 249.9, hardware, 10, images.keyboard),
  new Product(15, 'Mouse Wireless 16000 DPI', 199.9, hardware, 14, images.mouse),
  new Product(16, 'Jaqueta Corta-vento', 189.9, roupa, 8, images.windbreaker),
  new Product(17, 'Tênis Treino Lite', 249.9, roupa, 5, images.sneakers),
  new Product(18, 'Moletom Oversized', 159.9, roupa, 11, images.hoodie),
  new Product(19, 'Bermuda Dry Fit', 79.9, roupa, 16, images.shorts),
  new Product(20, 'Camisa Polo Essential', 89.9, roupa, 13, images.polo),
]
