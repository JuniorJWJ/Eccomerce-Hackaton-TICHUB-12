<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Checkbox from 'primevue/checkbox'
import ProductCard from '../components/ProductCard.vue'
import { productState } from '../state/products.store'
import { cartState } from '../state/cart.store'
import { Product } from '../model/product.model'
import { categories } from '../data/categories'
import { uiState } from '../state/ui.store'

function addToCart(product: Product): void {
  cartState.cart.addItem(product, 1)
}

const selectedCategory = ref<number | null>(null)

function toggleCategory(categoryId: number | null): void {
  if (selectedCategory.value === categoryId) {
    selectedCategory.value = null
    return
  }
  selectedCategory.value = categoryId
}

const sortOptions = [
  { label: 'Relevância', value: 'relevance' },
  { label: 'Menor preço', value: 'price-asc' },
  { label: 'Maior preço', value: 'price-desc' },
  { label: 'Mais vendidos', value: 'stock-desc' },
]

const filteredProducts = computed(() => {
  const term = uiState.searchTerm.trim().toLowerCase()
  const minPrice = uiState.minPrice ? Number(uiState.minPrice) : 0
  const maxPrice = uiState.maxPrice ? Number(uiState.maxPrice) : 0

  const filtered = productState.products.filter((product) => {
    const matchesCategory = selectedCategory.value
      ? product.category.id === selectedCategory.value
      : true
    const matchesTerm = term ? product.name.toLowerCase().includes(term) : true
    const matchesMin = minPrice ? product.price >= minPrice : true
    const matchesMax = maxPrice ? product.price <= maxPrice : true
    const matchesStock = uiState.inStockOnly ? product.stock > 0 : true
    return matchesCategory && matchesTerm && matchesMin && matchesMax && matchesStock
  })

  const sorted = [...filtered]
  if (uiState.sortBy === 'price-asc') {
    sorted.sort((a, b) => a.price - b.price)
  } else if (uiState.sortBy === 'price-desc') {
    sorted.sort((a, b) => b.price - a.price)
  } else if (uiState.sortBy === 'stock-desc') {
    sorted.sort((a, b) => b.stock - a.stock)
  }

  return sorted
})

const featuredProducts = computed(() => productState.products.slice(0, 5))
const featuredIndex = ref(0)

function nextFeatured(): void {
  featuredIndex.value = (featuredIndex.value + 1) % featuredProducts.value.length
}

function prevFeatured(): void {
  featuredIndex.value =
    (featuredIndex.value - 1 + featuredProducts.value.length) % featuredProducts.value.length
}

let intervalId: number | undefined

onMounted(() => {
  if (featuredProducts.value.length > 1) {
    intervalId = window.setInterval(() => {
      nextFeatured()
    }, 4500)
  }
})

onBeforeUnmount(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<template>
  <div class="space-y-10">
    <section
      class="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/80 p-8 shadow-sm"
    >
      <div class="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-slate-100" />
      <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Nova coleção</p>
          <h1 class="mt-3 text-3xl font-semibold text-slate-900 md:text-4xl">
            Monte seu carrinho com as escolhas certas
          </h1>
          <p class="mt-3 max-w-xl text-sm text-slate-500">
            Produtos selecionados, entrega rápida e uma experiência de compra organizada do início ao
            fim.
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#vitrine"
              class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
            >
              Explorar vitrine
            </a>
            <a
              href="#ofertas"
              class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600"
            >
              Ver ofertas
            </a>
          </div>
        </div>
        <div class="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 p-6 text-white shadow-lg">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-300">Destaque</p>
          <h2 class="mt-3 text-2xl font-semibold">Kit Performance</h2>
          <p class="mt-2 text-sm text-slate-200">
            Suplementos essenciais e itens de treino com preço especial.
          </p>
          <div class="mt-6 flex items-end justify-between">
            <div>
              <p class="text-3xl font-semibold">R$ 149,90</p>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-300">A partir de</p>
            </div>
            <a
              href="#kit"
              class="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]"
            >
              Ver kit
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Destaques</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-900">Carrossel de novidades</h2>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
            @click="prevFeatured"
          >
            Anterior
          </button>
          <button
            class="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
            @click="nextFeatured"
          >
            Próximo
          </button>
        </div>
      </div>

      <div class="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div v-if="featuredProducts.length" class="grid gap-6 lg:grid-cols-[280px_1fr]">
          <div
            class="flex h-52 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-200 text-4xl font-semibold text-slate-500"
          >
            {{ featuredProducts[featuredIndex].name.slice(0, 2).toUpperCase() }}
          </div>
          <div class="flex flex-col justify-between gap-4">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">{{ featuredProducts[featuredIndex].category.getDisplayName() }}</p>
              <h3 class="mt-2 text-2xl font-semibold text-slate-900">
                {{ featuredProducts[featuredIndex].name }}
              </h3>
              <p class="mt-2 text-sm text-slate-500">
                Estoque disponível: {{ featuredProducts[featuredIndex].stock }} unidades.
              </p>
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <button
                class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
                @click="addToCart(featuredProducts[featuredIndex])"
              >
                Adicionar ao carrinho
              </button>
              <RouterLink
                class="text-sm font-semibold text-slate-600"
                :to="{ name: 'product-details', params: { id: featuredProducts[featuredIndex].id } }"
              >
                Ver detalhes
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section id="ofertas" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Ofertas</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-900">Combos e promoções</h2>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Suplementos</p>
          <h3 class="mt-2 text-xl font-semibold">Combo Hipertrofia</h3>
          <p class="mt-2 text-sm text-slate-500">Whey + Creatina + BCAA com 15% off.</p>
          <a href="#vitrine" class="mt-4 inline-flex text-sm font-semibold text-slate-700">
            Ver produtos
          </a>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Hardware</p>
          <h3 class="mt-2 text-xl font-semibold">Setup Pro</h3>
          <p class="mt-2 text-sm text-slate-500">SSD + Monitor + Periféricos com frete grátis.</p>
          <a href="#vitrine" class="mt-4 inline-flex text-sm font-semibold text-slate-700">
            Ver produtos
          </a>
        </div>
      </div>
    </section>

    <section id="kit" class="space-y-6">
      <div>
        <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Kit especial</p>
        <h2 class="mt-2 text-2xl font-semibold text-slate-900">Seleção Performance</h2>
        <p class="mt-2 text-sm text-slate-500">
          Itens recomendados para quem quer resultado rápido.
        </p>
      </div>
      <div class="grid gap-4 md:grid-cols-3">
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold">Whey + Creatina</p>
          <p class="text-sm text-slate-500">R$ 139,90</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold">Pré-treino + BCAA</p>
          <p class="text-sm text-slate-500">R$ 119,90</p>
        </div>
        <div class="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <p class="text-sm font-semibold">Camiseta + Bermuda</p>
          <p class="text-sm text-slate-500">R$ 129,90</p>
        </div>
      </div>
    </section>

    <section id="vitrine" class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Vitrine</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-900">Produtos em destaque</h2>
          <p class="mt-2 text-sm text-slate-500">
            {{ filteredProducts.length }} item(ns) encontrados.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            class="rounded-full border px-4 py-1 text-xs font-semibold"
            :class="selectedCategory === null
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-500'"
            @click="toggleCategory(null)"
          >
            Todos
          </button>
          <button
            v-for="category in categories"
            :key="category.id"
            class="rounded-full border px-4 py-1 text-xs font-semibold"
            :class="selectedCategory === category.id
              ? 'border-slate-900 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-500'"
            @click="toggleCategory(category.id)"
          >
            {{ category.title }}
          </button>
        </div>
      </div>

      <div class="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <div class="grid gap-2">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Preço mínimo</label>
          <InputNumber v-model="uiState.minPrice" mode="currency" currency="BRL" locale="pt-BR" />
        </div>
        <div class="grid gap-2">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Preço máximo</label>
          <InputNumber v-model="uiState.maxPrice" mode="currency" currency="BRL" locale="pt-BR" />
        </div>
        <div class="grid gap-2">
          <label class="text-xs uppercase tracking-[0.2em] text-slate-400">Ordenar por</label>
          <Dropdown v-model="uiState.sortBy" :options="sortOptions" optionLabel="label" optionValue="value" />
        </div>
        <div class="flex items-center gap-2 pt-6">
          <Checkbox v-model="uiState.inStockOnly" :binary="true" inputId="inStockOnly" />
          <label for="inStockOnly" class="text-sm text-slate-600">Somente em estoque</label>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
          @add="addToCart"
        />
      </div>
    </section>
  </div>
</template>
