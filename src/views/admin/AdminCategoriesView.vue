<script lang="ts" setup>
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { categoryState, addCategory, removeCategory, updateCategory } from '../../state/categories.store'
import type { Product } from '../../model/product.model'
import { productState } from '../../state/products.store'

const name = ref('')
const error = ref('')
const editingId = ref<number | null>(null)
const editName = ref('')

const categories = computed(() => categoryState.categories)
const categoriesInUse = computed(() =>
  new Set(productState.products.map((product: Product) => product.category.id)),
)

function handleAdd(): void {
  error.value = ''

  if (!name.value.trim()) {
    error.value = 'Informe o nome da categoria.'
    return
  }

  addCategory(name.value.trim())
  name.value = ''
}

function startEdit(id: number, title: string): void {
  editingId.value = id
  editName.value = title
  error.value = ''
}

function cancelEdit(): void {
  editingId.value = null
  editName.value = ''
}

function handleUpdate(id: number): void {
  error.value = ''

  if (!editName.value.trim()) {
    error.value = 'Informe o nome da categoria.'
    return
  }

  const updated = updateCategory(id, editName.value)
  if (!updated) {
    error.value = 'Não foi possível atualizar a categoria.'
    return
  }

  cancelEdit()
}

function handleDelete(id: number): void {
  error.value = ''

  if (categoriesInUse.value.has(id)) {
    error.value = 'Não é possível excluir. Categoria em uso por produtos.'
    return
  }

  const confirmDelete = window.confirm('Deseja remover esta categoria?')
  if (!confirmDelete) {
    return
  }

  const removed = removeCategory(id)
  if (!removed) {
    error.value = 'Não foi possível remover a categoria.'
  }
}
</script>

<template>
  <Card class="rounded-3xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
    <template #content>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h2 class="text-2xl font-semibold">Categorias</h2>
          <p class="mt-1 text-sm text-slate-400">Crie novas categorias para organizar a vitrine.</p>
        </div>
      </div>

      <div class="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto]">
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-200">Nome da categoria</label>
          <InputText v-model="name" placeholder="Ex.: Acessórios" />
        </div>
        <div class="flex items-end">
          <PButton label="Adicionar" icon="pi pi-plus" @click="handleAdd" />
        </div>
      </div>

      <div
        v-if="error"
        class="mt-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
      >
        {{ error }}
      </div>

      <DataTable
        :value="categories"
        class="mt-6 rounded-2xl border border-slate-800/60"
        tableStyle="min-width: 100%"
      >
        <Column field="id" header="ID" />
        <Column header="Categoria">
          <template #body="{ data }">
            <div v-if="editingId === data.id" class="flex items-center gap-2">
              <InputText v-model="editName" class="w-full" />
            </div>
            <span v-else>{{ data.title }}</span>
          </template>
        </Column>
        <Column header="Ações">
          <template #body="{ data }">
            <div class="flex flex-wrap gap-2">
              <template v-if="editingId === data.id">
                <PButton size="small" label="Salvar" icon="pi pi-check" @click="handleUpdate(data.id)" />
                <PButton size="small" label="Cancelar" severity="secondary" @click="cancelEdit" />
              </template>
              <template v-else>
                <PButton
                  size="small"
                  label="Editar"
                  icon="pi pi-pencil"
                  severity="secondary"
                  @click="startEdit(data.id, data.title)"
                />
                <PButton
                  size="small"
                  label="Excluir"
                  icon="pi pi-trash"
                  severity="danger"
                  @click="handleDelete(data.id)"
                />
              </template>
            </div>
          </template>
        </Column>
      </DataTable>
    </template>
  </Card>
</template>
