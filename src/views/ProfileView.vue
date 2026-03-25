<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import { authState, updateProfile } from '../state/auth.store'
import { getOrdersByUser } from '../state/orders.store'

const profile = computed(() => authState.profile)

const name = ref(profile.value.name)
const email = ref(profile.value.email)
const phone = ref(profile.value.phone)
const address = ref(profile.value.address)
const city = ref(profile.value.city)
const state = ref(profile.value.state)
const zip = ref(profile.value.zip)
const photoUrl = ref(profile.value.photoUrl)
const mockAvatars = [
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><rect width=\"120\" height=\"120\" fill=\"%23F8B4B4\"/><circle cx=\"60\" cy=\"48\" r=\"22\" fill=\"%23fff\"/><rect x=\"28\" y=\"76\" width=\"64\" height=\"28\" rx=\"14\" fill=\"%23fff\"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><rect width=\"120\" height=\"120\" fill=\"%239DD7F7\"/><circle cx=\"60\" cy=\"48\" r=\"22\" fill=\"%23fff\"/><rect x=\"28\" y=\"76\" width=\"64\" height=\"28\" rx=\"14\" fill=\"%23fff\"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><rect width=\"120\" height=\"120\" fill=\"%23FBD38D\"/><circle cx=\"60\" cy=\"48\" r=\"22\" fill=\"%23fff\"/><rect x=\"28\" y=\"76\" width=\"64\" height=\"28\" rx=\"14\" fill=\"%23fff\"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"120\"><rect width=\"120\" height=\"120\" fill=\"%239AE6B4\"/><circle cx=\"60\" cy=\"48\" r=\"22\" fill=\"%23fff\"/><rect x=\"28\" y=\"76\" width=\"64\" height=\"28\" rx=\"14\" fill=\"%23fff\"/></svg>',
]

const saved = ref(false)
const orders = computed(() =>
  authState.user ? getOrdersByUser(authState.user.id) : [],
)
const loadingOrders = ref(true)

onMounted(() => {
  setTimeout(() => {
    loadingOrders.value = false
  }, 600)
})

function formatStatus(status: string): string {
  if (status === 'confirmed') return 'Pedido confirmado'
  if (status === 'separacao') return 'Separação'
  if (status === 'enviado') return 'Enviado'
  return status
}

watch(profile, (next) => {
  name.value = next.name
  email.value = next.email
  phone.value = next.phone
  address.value = next.address
  city.value = next.city
  state.value = next.state
  zip.value = next.zip
  photoUrl.value = next.photoUrl
})

function handleSave(): void {
  updateProfile({
    name: name.value,
    email: email.value,
    phone: phone.value,
    address: address.value,
    city: city.value,
    state: state.value,
    zip: zip.value,
    photoUrl: photoUrl.value,
  })
  saved.value = true
  setTimeout(() => {
    saved.value = false
  }, 2000)
}

function handlePhotoUpload(event: Event): void {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) {
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const result = reader.result
    if (typeof result === 'string') {
      photoUrl.value = result
    }
  }
  reader.readAsDataURL(file)
}

function clearPhoto(): void {
  photoUrl.value = ''
}

function selectMockAvatar(avatar: string): void {
  photoUrl.value = avatar
}
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Perfil</p>
            <h2 class="text-2xl font-semibold">Seus dados</h2>
            <p class="mt-2 text-sm text-slate-500">
              Atualize seus dados pessoais e foto para agilizar compras.
            </p>
          </div>
          <PButton label="Salvar" icon="pi pi-check" @click="handleSave" />
        </div>
      </template>
    </Card>

    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="grid gap-6">
            <div class="grid gap-4 md:grid-cols-2">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-slate-600">Nome completo</label>
                <InputText v-model="name" placeholder="Seu nome" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-slate-600">E-mail</label>
                <InputText v-model="email" placeholder="seuemail@exemplo.com" disabled />
              </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Telefone</label>
              <InputMask v-model="phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Upload de foto</label>
              <input type="file" accept="image/*" @change="handlePhotoUpload" />
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Endereço</label>
              <Textarea v-model="address" rows="3" placeholder="Rua, número e complemento" />
            </div>
            <div class="grid gap-4">
              <div class="grid gap-2">
                <label class="text-sm font-medium text-slate-600">Cidade</label>
                <InputText v-model="city" placeholder="Cidade" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-slate-600">Estado</label>
                <InputText v-model="state" placeholder="UF" />
              </div>
              <div class="grid gap-2">
                <label class="text-sm font-medium text-slate-600">CEP</label>
                <InputMask v-model="zip" mask="99999-999" placeholder="00000-000" />
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <p class="text-sm font-medium text-slate-600">Avatares mockados</p>
            <div class="flex flex-wrap gap-3">
              <button
                v-for="avatar in mockAvatars"
                :key="avatar"
                class="h-12 w-12 overflow-hidden rounded-full border border-slate-200"
                type="button"
                @click="selectMockAvatar(avatar)"
              >
                <img :src="avatar" alt="Avatar mockado" class="h-full w-full object-cover" />
              </button>
            </div>
          </div>

          <div
            v-if="photoUrl"
            class="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <img
              :src="photoUrl"
              alt="Foto do perfil"
              class="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p class="text-sm font-semibold text-slate-900">Prévia da foto</p>
              <p class="text-xs text-slate-500">Essa imagem aparecerá no seu perfil.</p>
            </div>
            <PButton size="small" severity="secondary" label="Remover" @click="clearPhoto" />
          </div>

          <div
            v-if="saved"
            class="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            Perfil atualizado com sucesso.
          </div>
        </div>
      </template>
    </Card>

    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Compras</p>
            <h3 class="text-xl font-semibold">Seu histórico</h3>
          </div>
        </div>

        <div v-if="loadingOrders" class="mt-6 grid gap-3">
          <div
            v-for="n in 2"
            :key="n"
            class="h-24 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
          />
        </div>
        <div v-else-if="orders.length" class="mt-6 space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
          >
            <div class="flex flex-wrap items-center justify-between gap-2">
              <p class="text-sm font-semibold text-slate-900">Pedido {{ order.id }}</p>
              <p class="text-xs text-slate-500">
                {{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}
              </p>
            </div>
            <ul class="mt-3 space-y-2 text-sm text-slate-600">
              <li v-for="item in order.items" :key="item.productId">
                {{ item.quantity }}x {{ item.name }} ·
                {{ item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                <span class="ml-2 text-xs text-slate-400">({{ formatStatus(item.status) }})</span>
              </li>
            </ul>
            <p class="mt-3 text-sm font-semibold text-slate-900">
              Total: {{ order.totalAfter.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </p>
            <p class="mt-2 text-xs text-slate-500">
              Status atual: {{ formatStatus(order.status) }}
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="step in order.statusHistory"
                :key="step.at"
                class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
              >
                {{ formatStatus(step.status) }}
              </span>
            </div>
          </div>
        </div>

        <p v-else class="mt-4 text-sm text-slate-500">Você ainda não realizou compras.</p>
      </template>
    </Card>
  </div>
</template>
