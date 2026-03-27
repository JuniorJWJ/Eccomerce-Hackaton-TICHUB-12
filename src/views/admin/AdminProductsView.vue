<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import Card from 'primevue/card'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import PButton from 'primevue/button'
import Tag from 'primevue/tag'
import { productState, removeProduct } from '../../state/products.store'
import { uiState } from '../../state/ui.store'
import type { Product } from '../../model/product.model'

const router = useRouter()

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const outOfStockCount = computed(() =>
  productState.products.filter((product: Product) => product.stock === 0).length,
)
const lowStockCount = computed(() =>
  productState.products.filter((product: Product) => product.stock > 0 && product.stock <= 3).length,
)

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

function handleDelete(productId: number): void {
  const confirmed = window.confirm('Deseja remover este produto?')
  if (!confirmed) {
    return
  }

  const removed = removeProduct(productId)
  if (!removed) {
    alert('Produto possui pedidos associados. Estoque zerado.')
  }
}
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
      <template #content>
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
            <h2 class="text-2xl font-semibold">Produtos</h2>
            <p class="mt-1 text-sm text-slate-400">
              Controle estoque, cadastre novos itens e edite produtos existentes.
            </p>
          </div>
          <div class="flex flex-wrap gap-3">
            <PButton
              label="Ver vitrine"
              icon="pi pi-eye"
              severity="secondary"
              @click="uiState.adminPreviewMode = true; router.push({ name: 'home' })"
            />
            <PButton
              label="Cadastrar produto"
              icon="pi pi-plus"
              class="self-start"
              @click="router.push({ name: 'admin-product-new' })"
            />
          </div>
        </div>

        <div class="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
            <p class="mt-2 text-2xl font-semibold text-slate-100">
              {{ productState.products.length }}
            </p>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Baixo estoque</p>
            <p class="mt-2 text-2xl font-semibold text-amber-300">{{ lowStockCount }}</p>
          </div>
          <div class="rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Esgotados</p>
            <p class="mt-2 text-2xl font-semibold text-rose-300">{{ outOfStockCount }}</p>
          </div>
        </div>

        <div
          v-if="outOfStockCount"
          class="mt-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
        >
          Existem {{ outOfStockCount }} produto(s) esgotado(s). Atualize o estoque para liberar novas
          vendas.
        </div>

        <DataTable
          :value="productState.products"
          class="mt-6 rounded-2xl border border-slate-800/60"
          tableStyle="min-width: 100%"
        >
          <Column field="id" header="ID" />
          <Column field="name" header="Produto" />
          <Column header="Preço">
            <template #body="{ data }">
              {{ formatPrice(data.price) }}
            </template>
          </Column>
          <Column header="Categoria">
            <template #body="{ data }">
              {{ data.category.getDisplayName() }}
            </template>
          </Column>
          <Column header="Estoque">
            <template #body="{ data }">
              <span class="font-semibold">{{ data.stock }}</span>
            </template>
          </Column>
          <Column header="Status">
            <template #body="{ data }">
              <Tag v-if="data.stock === 0" value="Esgotado" severity="danger" />
              <Tag v-else-if="data.stock <= 3" value="Baixo" severity="warning" />
              <Tag v-else value="OK" severity="success" />
            </template>
          </Column>
          <Column header="Ações">
            <template #body="{ data }">
              <RouterLink :to="{ name: 'admin-product-edit', params: { id: data.id } }">
                <PButton label="Editar" icon="pi pi-pencil" size="small" severity="secondary" />
              </RouterLink>
              <PButton
                class="ml-2"
                label="Excluir"
                icon="pi pi-trash"
                size="small"
                severity="danger"
                @click="handleDelete(data.id)"
              />
            </template>
          </Column>
        </DataTable>
      </template>
    </Card>
  </div>
</template>