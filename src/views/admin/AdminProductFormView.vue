<script lang="ts" setup>
import { computed, reactive, ref, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import PButton from 'primevue/button'
import { categories } from '../../data/categories'
import { categoryState } from '../../state/categories.store'
import { addProduct, getProductById, updateProduct } from '../../state/products.store'

const route = useRoute()
const router = useRouter()

const productId = computed(() => Number(route.params.id))
const isEdit = computed(() => Number.isFinite(productId.value) && productId.value > 0)
const existingProduct = computed(() =>
  isEdit.value ? getProductById(productId.value) : undefined,
)

const form = reactive({
  name: '',
  price: 0,
  stock: 0,
  categoryId: categories[0]?.id ?? 0,
  imageUrl: '',
})

const categoryOptions = computed(() => categoryState.categories)

const error = ref('')
const initialized = ref(false)

watch(
  existingProduct,
  (product) => {
    if (!product || initialized.value) {
      return
    }

    form.name = product.name
    form.price = product.price
    form.stock = product.stock
    form.categoryId = product.category.id
    form.imageUrl = product.imageUrl
    initialized.value = true
  },
  { immediate: true },
)

function handleImageUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result
    if (typeof result === 'string') {
      form.imageUrl = result
    }
  }
  reader.readAsDataURL(file)
}

function handleSave(): void {
  error.value = ''

  if (!form.name.trim()) {
    error.value = 'Informe o nome do produto.'
    return
  }

  if (form.price < 0) {
    error.value = 'O preço não pode ser negativo.'
    return
  }

  if (form.stock < 0) {
    error.value = 'O estoque não pode ser negativo.'
    return
  }

  const selectedCategory = categoryOptions.value.find((category) => category.id === form.categoryId)
  if (!selectedCategory) {
    error.value = 'Selecione uma categoria válida.'
    return
  }

  if (isEdit.value) {
    const updated = updateProduct(productId.value, {
      name: form.name,
      price: form.price,
      category: selectedCategory,
      stock: form.stock,
      imageUrl: form.imageUrl,
    })

    if (!updated) {
      error.value = 'Produto não encontrado.'
      return
    }
  } else {
    addProduct({
      name: form.name,
      price: form.price,
      category: selectedCategory,
      stock: form.stock,
      imageUrl: form.imageUrl,
    })
  }

  router.push({ name: 'admin-products' })
}
</script>

<template>
  <Card class="rounded-2xl border border-slate-800/60 bg-slate-900/70 p-6 shadow-lg">
    <template #content>
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h2 class="text-2xl font-semibold">
            {{ isEdit ? 'Editar produto' : 'Cadastrar produto' }}
          </h2>
          <p class="mt-1 text-sm text-slate-400">
            Preencha as informações do produto para atualizar a vitrine.
          </p>
        </div>
        <RouterLink :to="{ name: 'admin-products' }" class="text-sm text-slate-300 hover:text-white">
          Voltar para produtos
        </RouterLink>
      </div>

      <div
        v-if="error"
        class="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
      >
        {{ error }}
      </div>

      <div class="mt-6 grid gap-5">
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-200">Nome do produto</label>
          <InputText v-model="form.name" placeholder="Ex.: Whey Protein 1kg" />
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-200">Upload de imagem</label>
          <input type="file" accept="image/*" @change="handleImageUpload" />
        </div>
        <div
          v-if="form.imageUrl"
          class="flex items-center gap-4 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-4"
        >
          <img :src="form.imageUrl" alt="Prévia do produto" class="h-20 w-20 rounded-xl object-cover" />
          <div>
            <p class="text-sm font-semibold text-slate-100">Prévia da imagem</p>
            <p class="text-xs text-slate-400">A foto aparece na vitrine.</p>
          </div>
        </div>
        <div class="grid gap-2">
          <label class="text-sm font-medium text-slate-200">Categoria</label>
          <Dropdown
            v-model="form.categoryId"
            :options="categoryOptions"
            optionLabel="title"
            optionValue="id"
            placeholder="Selecione"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-200">Preço</label>
            <InputNumber
              v-model="form.price"
              mode="currency"
              currency="BRL"
              locale="pt-BR"
              :min="0"
            />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-200">Estoque</label>
            <InputNumber v-model="form.stock" :min="0" />
          </div>
        </div>
      </div>

      <div class="mt-8 flex flex-wrap items-center gap-3">
        <PButton
          :label="isEdit ? 'Salvar alterações' : 'Cadastrar produto'"
          icon="pi pi-check"
          @click="handleSave"
        />
        <RouterLink class="text-sm text-slate-400 hover:text-slate-100" :to="{ name: 'admin-products' }">
          Cancelar
        </RouterLink>
      </div>
    </template>
  </Card>
</template>
