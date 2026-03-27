<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import Tag from 'primevue/tag'
import { authState } from '../state/auth.store'
import { getOrdersByUser } from '../state/orders.store'
import type { Order, OrderItem } from '../state/orders.store'

const loadingOrders = ref(true)
const selectedStatus = ref<'all' | 'confirmed' | 'separacao' | 'enviado'>('all')

const orders = computed(() => (authState.user ? getOrdersByUser(authState.user.id) : []))
const filteredOrders = computed(() => {
  if (selectedStatus.value === 'all') {
    return orders.value
  }
  return orders.value.filter((order: Order) => order.status === selectedStatus.value)
})

const totalOrders = computed(() => orders.value.length)

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

function statusSeverity(status: string): 'success' | 'info' | 'warning' | 'danger' {
  if (status === 'enviado') return 'success'
  if (status === 'separacao') return 'info'
  if (status === 'confirmed') return 'warning'
  return 'danger'
}
</script>

<template>
  <div class="space-y-6">
    <Card class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
      <template #content>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Pedidos</p>
            <h2 class="text-2xl font-semibold">Meus pedidos</h2>
            <p class="mt-1 text-sm text-slate-500">
              Acompanhe o status de cada compra e veja os itens separados por pedido.
            </p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Total</p>
            <p class="text-sm font-semibold text-slate-900">{{ totalOrders }} pedidos</p>
          </div>
        </div>

        <div class="mt-6 flex flex-wrap items-center gap-2">
          <PButton
            size="small"
            :severity="selectedStatus === 'all' ? 'contrast' : 'secondary'"
            label="Todos"
            @click="selectedStatus = 'all'"
          />
          <PButton
            size="small"
            :severity="selectedStatus === 'confirmed' ? 'warning' : 'secondary'"
            label="Confirmados"
            @click="selectedStatus = 'confirmed'"
          />
          <PButton
            size="small"
            :severity="selectedStatus === 'separacao' ? 'info' : 'secondary'"
            label="Separação"
            @click="selectedStatus = 'separacao'"
          />
          <PButton
            size="small"
            :severity="selectedStatus === 'enviado' ? 'success' : 'secondary'"
            label="Enviados"
            @click="selectedStatus = 'enviado'"
          />
        </div>
      </template>
    </Card>

    <div v-if="loadingOrders" class="grid gap-3">
      <div
        v-for="n in 3"
        :key="n"
        class="h-28 animate-pulse rounded-2xl border border-slate-200 bg-slate-100"
      />
    </div>

    <div v-else-if="filteredOrders.length" class="space-y-4">
      <Card
        v-for="order in filteredOrders"
        :key="order.id"
        class="rounded-3xl border border-slate-200/70 bg-white/95 p-6 shadow-sm"
      >
        <template #content>
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-slate-900">Pedido {{ order.id }}</p>
              <p class="text-xs text-slate-500">
                {{ new Date(order.createdAt).toLocaleDateString('pt-BR') }}
              </p>
            </div>
            <Tag :value="formatStatus(order.status)" :severity="statusSeverity(order.status)" />
          </div>

          <div class="mt-4 space-y-2 text-sm text-slate-600">
            <div
              v-for="item in order.items"
              :key="item.productId"
              class="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
            >
              <div class="flex items-center gap-2">
                <span class="font-semibold">{{ item.quantity }}x</span>
                <span>{{ item.name }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-xs text-slate-500">
                  {{ item.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
                </span>
                <Tag
                  :value="formatStatus(item.status)"
                  :severity="statusSeverity(item.status)"
                  class="text-xs"
                />
              </div>
            </div>
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p class="font-semibold text-slate-900">
              Total: {{ order.totalAfter.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) }}
            </p>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="step in order.statusHistory"
                :key="step.at"
                class="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
              >
                {{ formatStatus(step.status) }}
              </span>
            </div>
          </div>
        </template>
      </Card>
    </div>

    <Card
      v-else
      class="rounded-3xl border border-dashed border-slate-300 bg-white/80 p-6 text-center shadow-sm"
    >
      <template #content>
        <p class="text-sm text-slate-500">Você ainda não realizou compras.</p>
      </template>
    </Card>
  </div>
</template>
