<script lang="ts" setup>
import ProductCard from '../components/ProductCard.vue'
import { productState } from '../state/products.store'
import { cartState } from '../state/cart.store'
import { Product } from '../model/product.model'

function addToCart(product: Product): void {
  cartState.cart.addItem(product, 1)
}
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
            <button class="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white">
              Explorar vitrine
            </button>
            <button class="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-600">
              Ver ofertas
            </button>
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
            <button class="rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em]">
              Ver kit
            </button>
          </div>
        </div>
      </div>
    </section>

    <section class="space-y-6">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.3em] text-slate-400">Vitrine</p>
          <h2 class="mt-2 text-2xl font-semibold text-slate-900">Produtos em destaque</h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <span class="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-500">
            Todos
          </span>
          <span class="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-500">
            Suplementos
          </span>
          <span class="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-500">
            Hardware
          </span>
          <span class="rounded-full border border-slate-200 bg-white px-4 py-1 text-xs font-semibold text-slate-500">
            Moda
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ProductCard
          v-for="product in productState.products"
          :key="product.id"
          :product="product"
          @add="addToCart"
        />
      </div>
    </section>
  </div>
</template>
