<script lang="ts" setup>
import { computed } from 'vue'
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
const shareUrl = computed(() => window.location.href)
const qrUrl = computed(
  () =>
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
      shareUrl.value,
    )}`,
)
const canShare = computed(() => typeof navigator !== 'undefined' && 'share' in navigator)

function addToCart(): void {
  if (product) {
    cartState.cart.addItem(product, 1)
  }
}

async function copyLink(): Promise<void> {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    alert('Link copiado para compartilhar.')
  } catch {
    alert('Não foi possível copiar o link. Copie manualmente.')
  }
}

async function shareLink(): Promise<void> {
  if (!canShare.value) {
    await copyLink()
    return
  }

  try {
    await navigator.share({
      title: product?.name ?? 'Produto',
      text: 'Confira este produto',
      url: shareUrl.value,
    })
  } catch {
    // ignore cancel
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
            <div class="h-64 overflow-hidden rounded-3xl bg-slate-100 shadow-inner">
              <img
                :src="product.imageUrl"
                :alt="product.name"
                class="h-full w-full object-cover"
              />
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
              <PButton
                v-if="canShare"
                label="Compartilhar"
                icon="pi pi-share-alt"
                severity="info"
                @click="shareLink"
              />
              <PButton
                label="Copiar link"
                icon="pi pi-link"
                severity="secondary"
                @click="copyLink"
              />
              <RouterLink class="text-sm text-slate-500 hover:text-slate-700" to="/">
                Voltar para a vitrine
              </RouterLink>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
              <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Link compartilhável</p>
              <p class="mt-2 break-all">{{ shareUrl }}</p>
              <div class="mt-4 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <img
                  :src="qrUrl"
                  alt="QR code do produto"
                  class="h-28 w-28 rounded-xl border border-slate-200 bg-white"
                />
                <p class="text-xs text-slate-500">
                  Escaneie o QR code para abrir o produto no celular.
                </p>
              </div>
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
