<script lang="ts" setup>
import { RouterLink, useRouter } from 'vue-router'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import Tag from 'primevue/tag'
import { Product } from '../model/product.model'

const props = defineProps<{ product: Product }>()
const emit = defineEmits<{ add: [Product] }>()
const router = useRouter()

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

function handleAdd(): void {
  if (props.product.stock === 0) {
    return
  }
  emit('add', props.product)
}

function goToDetails(): void {
  router.push({ name: 'product-details', params: { id: props.product.id } })
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

const ratingSeed = (props.product.id % 5) + 1
const rating = Math.min(5, 3.5 + ratingSeed * 0.2)
</script>

<template>
  <Card
    class="group h-full cursor-pointer overflow-hidden rounded-3xl border border-slate-200/70 bg-white/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900/80"
    @click="goToDetails"
  >
    <template #content>
      <div class="flex h-full min-h-[300px] flex-col">
        <div class="relative">
          <div class="h-40 overflow-hidden rounded-2xl bg-slate-100 shadow-inner">
            <img
              :src="product.imageUrl"
              :alt="product.name"
              class="h-full w-full object-cover"
            />
          </div>
          <div class="absolute right-3 top-3 flex items-center gap-2">
            <Tag v-if="product.stock === 0" value="Esgotado" severity="danger" />
            <Tag v-else-if="product.stock <= 3" value="Baixo" severity="warning" />
          </div>
        </div>

        <div class="mt-4 flex flex-1 flex-col gap-3">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
              {{ product.category.getDisplayName() }}
            </p>
            <h3 class="mt-1 text-base font-semibold leading-snug text-slate-900 dark:text-slate-100">
              {{ product.name }}
            </h3>
          </div>

          <div class="flex items-center gap-2 text-sm text-slate-500">
            <span class="text-amber-400">★</span>
            <span class="font-medium text-slate-700">{{ rating.toFixed(1) }}</span>
            <span class="text-slate-400">· {{ product.stock }} em estoque</span>
          </div>

          <div class="mt-auto flex items-center justify-between">
            <div>
              <p class="text-lg font-bold text-slate-900 dark:text-slate-100">
                {{ formatPrice(product.price) }}
              </p>
              <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Unidade</p>
            </div>
            <RouterLink
              @click.stop
              class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 hover:text-slate-600"
              :to="{ name: 'product-details', params: { id: product.id } }"
            >
              Detalhes
            </RouterLink>
          </div>

          <PButton
            :label="product.stock === 0 ? 'Indisponível' : 'Adicionar'"
            class="w-full"
            :disabled="product.stock === 0"
            :pt="{
              root: { class: 'justify-center rounded-xl' },
              label: { class: 'whitespace-nowrap text-sm font-semibold' },
            }"
            @click.stop="handleAdd"
          />
        </div>
      </div>
    </template>
  </Card>
</template>
