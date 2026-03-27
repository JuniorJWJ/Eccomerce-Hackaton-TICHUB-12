<script lang="ts" setup>
import { computed } from 'vue'
import Card from 'primevue/card'
import { productState } from '../../state/products.store'
import type { Product } from '../../model/product.model'

const totalProducts = computed(() => productState.products.length)
const totalStock = computed(() =>
  productState.products.reduce((total: number, product: Product) => total + product.stock, 0),
)
const outOfStock = computed(() =>
  productState.products.filter((product: Product) => product.stock === 0).length,
)
const estimatedRevenue = computed(() =>
  productState.products.reduce(
    (total: number, product: Product) => total + product.price * product.stock,
    0,
  ),
)

const topStock = computed(() => {
  const maxStock = Math.max(1, ...productState.products.map((product: Product) => product.stock))
  return productState.products
    .slice()
    .sort((a: Product, b: Product) => b.stock - a.stock)
    .slice(0, 5)
    .map((product: Product) => ({
      name: product.name,
      stock: product.stock,
      width: Math.round((product.stock / maxStock) * 100),
    }))
})

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
      <template #content>
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
        <h2 class="text-2xl font-semibold">Dashboard</h2>
        <p class="mt-2 text-sm text-slate-300">Resumo em tempo real da sua operação.</p>

        <div class="mt-6 grid gap-4 md:grid-cols-4">
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Produtos</p>
            <p class="mt-2 text-2xl font-semibold text-slate-100">{{ totalProducts }}</p>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Estoque total</p>
            <p class="mt-2 text-2xl font-semibold text-slate-100">{{ totalStock }}</p>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Esgotados</p>
            <p class="mt-2 text-2xl font-semibold text-rose-300">{{ outOfStock }}</p>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Receita estimada</p>
            <p class="mt-2 text-2xl font-semibold text-emerald-200">
              {{ currencyFormatter.format(estimatedRevenue) }}
            </p>
          </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
            <h3 class="text-sm font-semibold text-slate-200">Top estoque</h3>
            <div class="mt-4 space-y-3">
              <div v-for="item in topStock" :key="item.name" class="space-y-2">
                <div class="flex items-center justify-between text-xs text-slate-400">
                  <span>{{ item.name }}</span>
                  <span>{{ item.stock }} unidades</span>
                </div>
                <div class="h-2 rounded-full bg-slate-800">
                  <div
                    class="h-2 rounded-full bg-emerald-400"
                    :style="{ width: item.width + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-5">
            <h3 class="text-sm font-semibold text-slate-200">Insights rápidos</h3>
            <ul class="mt-4 space-y-3 text-sm text-slate-300">
              <li>Produtos em falta: {{ outOfStock }}.</li>
              <li>Estoques altos devem entrar em promoção.</li>
              <li>Revise produtos com baixo giro semanalmente.</li>
            </ul>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
