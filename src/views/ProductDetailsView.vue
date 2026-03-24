<script lang="ts" setup>
import { useRoute, RouterLink } from 'vue-router'
import { getProductById } from '../state/products.store'
import { cartState } from '../state/cart.store'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import Tag from 'primevue/tag'
import { Product } from '../model/product.model'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const route = useRoute()
const product = getProductById(Number(route.params.id)) as Product | undefined

function addToCart(): void {
  if (product) {
    cartState.cart.addItem(product, 1)
  }
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}
</script>

<template>
  <div class="space-y-6">
    <Card v-if="product" class="rounded-3xl border border-slate-200/70 bg-white/95 p-8 shadow-sm">
      <template #content>
        <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_1.1fr]">
          <div class="space-y-6">
            <div
              class="flex h-64 items-center justify-center rounded-3xl bg-gradient-to-br from-slate-100 via-white to-slate-200 text-4xl font-semibold text-slate-500 shadow-inner"
            >
              {{ product.name.slice(0, 2).toUpperCase() }}
            </div>
            <div class="flex flex-wrap items-center gap-3">
              <Tag value="Garantia 90 dias" severity="success" />
              <Tag value="Frete rápido" severity="info" />
              <Tag v-if="product.stock === 0" value="Esgotado" severity="danger" />
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Produto</p>
              <h2 class="mt-2 text-3xl font-semibold text-slate-900">{{ product.name }}</h2>
              <p class="mt-2 text-sm text-slate-500">
                Categoria: {{ product.category.getDisplayName() }}
              </p>
            </div>

            <div class="flex items-end justify-between">
              <div>
                <p class="text-4xl font-semibold text-slate-900">{{ formatPrice(product.price) }}</p>
                <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Unidade</p>
              </div>
              <div class="text-right text-sm text-slate-500">
                <p class="font-semibold text-slate-700">{{ product.stock }} em estoque</p>
                <p>Entrega em até 3 dias úteis</p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
              Conteúdo selecionado para performance, conforto e durabilidade. Ideal para montar seu
              kit completo.
            </div>

            <div class="flex flex-wrap items-center gap-3">
              <PButton
                label="Adicionar ao carrinho"
                icon="pi pi-plus"
                :disabled="product.stock === 0"
                @click="addToCart"
              />
              <RouterLink class="text-sm text-slate-500 hover:text-slate-700" to="/">
                Voltar para a vitrine
              </RouterLink>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card
      v-else
      class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-sm"
    >
      <template #content>
        <p class="text-sm text-slate-500">Produto não encontrado.</p>
        <RouterLink class="mt-3 inline-block text-sm text-slate-600" to="/">
          Voltar para a vitrine
        </RouterLink>
      </template>
    </Card>
  </div>
</template>
