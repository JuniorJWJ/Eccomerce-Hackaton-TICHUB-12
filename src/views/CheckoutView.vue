<script lang="ts" setup>
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import { cartState } from '../state/cart.store'
import { authState, updateProfile } from '../state/auth.store'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const totalItems = computed(() => cartState.cart.getTotalItems())
const totalPrice = computed(() => cartState.cart.getFinalPrice())

const name = ref(authState.profile.name || authState.user?.name || '')
const email = ref(authState.profile.email || authState.user?.email || '')
const phone = ref(authState.profile.phone)
const address = ref(authState.profile.address)
const city = ref(authState.profile.city)
const state = ref(authState.profile.state)
const zip = ref(authState.profile.zip)
const photoUrl = ref(authState.profile.photoUrl)

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const isPaid = ref(false)
const orderId = ref('')
const error = ref('')

const isGuest = computed(() => !authState.isAuthenticated)

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

function handlePay(): void {
  error.value = ''

  if (totalItems.value === 0) {
    error.value = 'Seu carrinho está vazio.'
    return
  }

  if (!name.value.trim() || !email.value.trim()) {
    error.value = 'Informe nome e e-mail para continuar.'
    return
  }

  if (!address.value.trim() || !city.value.trim() || !state.value.trim()) {
    error.value = 'Preencha o endereço completo para entrega.'
    return
  }

  if (!cardName.value.trim() || !cardNumber.value.trim() || !cardExpiry.value.trim()) {
    error.value = 'Preencha os dados do cartão para finalizar.'
    return
  }

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

  orderId.value = `LP-${Math.floor(Math.random() * 90000 + 10000)}`
  isPaid.value = true
}
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl font-semibold">Finalizar compra</h2>
            <p class="mt-2 text-sm text-slate-500">Revise os dados e simule o pagamento.</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Resumo</p>
            <p class="text-sm font-semibold text-slate-900">
              {{ totalItems }} itens · {{ formatPrice(totalPrice) }}
            </p>
          </div>
        </div>
      </template>
    </Card>

    <Card v-if="isPaid" class="rounded-3xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm">
      <template #content>
        <p class="text-xs uppercase tracking-[0.2em] text-emerald-500">Pagamento aprovado</p>
        <h3 class="mt-2 text-2xl font-semibold text-emerald-700">Pedido confirmado</h3>
        <p class="mt-2 text-sm text-emerald-700">
          Obrigado pela compra! Seu pedido {{ orderId }} está em processamento.
        </p>
      </template>
    </Card>

    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Perfil</p>
            <h3 class="text-xl font-semibold">Dados do comprador</h3>
            <p class="mt-1 text-sm text-slate-500">
              {{ isGuest ? 'Complete seu cadastro para finalizar.' : 'Confira seus dados.' }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Nome completo</label>
              <InputText v-model="name" placeholder="Seu nome" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">E-mail</label>
              <InputText v-model="email" placeholder="seuemail@exemplo.com" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Telefone</label>
              <InputMask v-model="phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Foto (URL)</label>
              <InputText v-model="photoUrl" placeholder="https://" />
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
              <p class="text-xs text-slate-500">Imagem usada no seu perfil.</p>
            </div>
          </div>
        </div>
      </template>
    </Card>

    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="space-y-6">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Pagamento</p>
            <h3 class="text-xl font-semibold">Cartão de crédito</h3>
            <p class="mt-1 text-sm text-slate-500">
              Simulação de pagamento. Nenhum dado real é processado.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="grid gap-2 md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Nome impresso no cartão</label>
              <InputText v-model="cardName" placeholder="Nome no cartão" />
            </div>
            <div class="grid gap-2 md:col-span-2">
              <label class="text-sm font-medium text-slate-600">Número do cartão</label>
              <InputMask v-model="cardNumber" mask="9999 9999 9999 9999" placeholder="0000 0000 0000 0000" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Validade</label>
              <InputMask v-model="cardExpiry" mask="99/99" placeholder="MM/AA" />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">CVV</label>
              <InputMask v-model="cardCvv" mask="999" placeholder="000" />
            </div>
          </div>

          <div v-if="error" class="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {{ error }}
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <PButton label="Simular pagamento" icon="pi pi-check" @click="handlePay" />
            <span class="text-sm text-slate-500">Total: {{ formatPrice(totalPrice) }}</span>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
