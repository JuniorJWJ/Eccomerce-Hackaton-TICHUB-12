<script lang="ts" setup>
import { computed, ref } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import { cartState, clearCart } from '../state/cart.store'
import { authState, updateProfile } from '../state/auth.store'
import { createOrder, updateOrderStatus } from '../state/orders.store'
import InputText from 'primevue/inputtext'
import { showToast } from '../state/ui.store'

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const totalItems = computed(() => cartState.cart.getTotalItems())
const subtotal = computed(() => cartState.cart.getFinalPrice())

const name = ref(authState.profile.name || authState.user?.name || '')
const email = ref(authState.profile.email || authState.user?.email || '')
const phone = ref(authState.profile.phone)
const address = ref(authState.profile.address)
const city = ref(authState.profile.city)
const state = ref(authState.profile.state)
const zip = ref(authState.profile.zip)

const cardName = ref('')
const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')

const isPaid = ref(false)
const orderId = ref('')
const error = ref('')
const orderSteps = ['Pedido confirmado', 'Separação', 'Enviado']
const orderStepIndex = ref(0)
const couponCode = ref('')
const discountPercent = ref(0)
const discountValue = computed(() => (subtotal.value * discountPercent.value) / 100)
const freightValue = ref(0)
const freightDays = ref<number | null>(null)
const totalDue = computed(() => Math.max(0, subtotal.value - discountValue.value + freightValue.value))
const freightMessage = ref('')

const isGuest = computed(() => !authState.isAuthenticated)

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

function applyCoupon(): void {
  const code = couponCode.value.trim().toUpperCase()
  if (!code) {
    discountPercent.value = 0
    error.value = ''
    return
  }

  if (code === 'HACK10') {
    discountPercent.value = 10
    error.value = ''
  } else if (code === 'PRIME20') {
    discountPercent.value = 20
    error.value = ''
  } else {
    discountPercent.value = 0
    error.value = 'Cupom inválido.'
  }
}

function calculateFreight(): void {
  const digits = (zip.value || '').replace(/\D/g, '')
  if (digits.length !== 8) {
    error.value = 'Informe um CEP válido para calcular o frete.'
    freightValue.value = 0
    freightDays.value = null
    freightMessage.value = 'Informe um CEP válido para calcular o frete.'
    showToast('Informe um CEP válido para calcular o frete.', 'warning')
    return
  }

  error.value = ''
  const region = Number(digits.charAt(0))
  if (region <= 2) {
    freightValue.value = 12
    freightDays.value = 2
  } else if (region <= 5) {
    freightValue.value = 18
    freightDays.value = 4
  } else {
    freightValue.value = 24
    freightDays.value = 6
  }
  freightMessage.value = `Frete calculado: ${formatPrice(freightValue.value)} · ${freightDays.value} dias úteis`
  showToast('Frete calculado com sucesso.', 'success')
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
  })

  const createdOrder = createOrder({
    discountCode: couponCode.value.trim() || undefined,
    discountPercent: discountPercent.value || undefined,
    totalAfter: totalDue.value,
  })
  orderId.value = createdOrder?.id ?? `LP-${Math.floor(Math.random() * 90000 + 10000)}`
  isPaid.value = true
  clearCart()
  orderStepIndex.value = 0
  if (createdOrder?.id) {
    setTimeout(() => {
      updateOrderStatus(createdOrder.id, 'separacao')
      orderStepIndex.value = 1
    }, 2000)
    setTimeout(() => {
      updateOrderStatus(createdOrder.id, 'enviado')
      orderStepIndex.value = 2
    }, 4500)
  }
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
              {{ totalItems }} itens · {{ formatPrice(subtotal) }}
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
        <div class="mt-6 grid gap-3">
          <div
            v-for="(step, index) in orderSteps"
            :key="step"
            class="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-white px-4 py-3 text-sm"
          >
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold"
              :class="index <= orderStepIndex ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-700'"
            >
              {{ index + 1 }}
            </span>
            <span class="font-semibold text-emerald-700">{{ step }}</span>
            <span class="ml-auto text-xs text-emerald-600">
              {{ index < orderStepIndex ? 'Concluído' : index === orderStepIndex ? 'Em andamento' : 'Aguardando' }}
            </span>
          </div>
        </div>
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
              <InputText v-model="email" placeholder="seuemail@exemplo.com" disabled />
            </div>
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Telefone</label>
              <InputMask v-model="phone" mask="(99) 99999-9999" placeholder="(11) 99999-9999" />
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
            <div class="flex items-end">
              <PButton label="Calcular frete" severity="secondary" @click="calculateFreight" />
            </div>
            <p v-if="freightMessage" class="text-xs text-slate-500">{{ freightMessage }}</p>
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
            <span class="text-sm text-slate-500">Total: {{ formatPrice(totalDue) }}</span>
          </div>

          <div class="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
            <div class="grid gap-2">
              <label class="text-sm font-medium text-slate-600">Cupom de desconto</label>
              <InputText v-model="couponCode" placeholder="HACK10" />
            </div>
            <div class="flex items-end">
              <PButton label="Aplicar cupom" severity="secondary" @click="applyCoupon" />
            </div>
          </div>

          <div class="mt-2 text-sm text-slate-500">
            <p>Subtotal: {{ formatPrice(subtotal) }}</p>
            <p v-if="discountPercent">Desconto: -{{ discountPercent }}% ({{ formatPrice(discountValue) }})</p>
            <p v-if="freightValue">
              Frete: {{ formatPrice(freightValue) }}
              <span v-if="freightDays">· {{ freightDays }} dias úteis</span>
            </p>
            <p class="font-semibold text-slate-700">Total: {{ formatPrice(totalDue) }}</p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
