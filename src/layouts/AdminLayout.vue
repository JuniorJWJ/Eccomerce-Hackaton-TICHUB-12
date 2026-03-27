<script lang="ts" setup>
import { RouterView, useRoute, useRouter } from 'vue-router'
import PMenu from 'primevue/menu'
import Breadcrumb from 'primevue/breadcrumb'
import PButton from 'primevue/button'
import InputSwitch from 'primevue/inputswitch'
import { uiState } from '../state/ui.store'
import { authState, logout } from '../state/auth.store'

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

const route = useRoute()
const router = useRouter()

const menuItems = [
  {
    label: 'Produtos',
    icon: 'pi pi-box',
    command: () => router.push({ name: 'admin-products' }),
  },
  {
    label: 'Categorias',
    icon: 'pi pi-tags',
    command: () => router.push({ name: 'admin-categories' }),
  },
  {
    label: 'Cadastrar produto',
    icon: 'pi pi-plus',
    command: () => router.push({ name: 'admin-product-new' }),
  },
  {
    label: 'Relatórios',
    icon: 'pi pi-chart-line',
    command: () => router.push({ name: 'admin-reports' }),
  },
]

const breadcrumbItems = (route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []

function logoutAdmin(): void {
  logout()
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
    <div class="mx-auto flex w-full max-w-6xl gap-6 px-6 py-8">
      <aside class="w-64 rounded-3xl border border-slate-800/60 bg-slate-900/80 p-5 shadow-xl">
        <div class="mb-6">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Admin</p>
          <h1 class="text-xl font-semibold">Painel de Gestão</h1>
          <p class="mt-1 text-xs text-slate-400">
            Usuário: {{ authState.user?.name ?? authState.role }}
          </p>
        </div>
        <div class="mb-6 rounded-2xl border border-slate-800/60 bg-slate-950/40 p-3">
          <div class="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>Modo vitrine</span>
            <InputSwitch v-model="uiState.adminPreviewMode" />
          </div>
          <p class="mt-2 text-xs text-slate-400">
            Veja como o cliente enxerga a vitrine e detalhes.
          </p>
        </div>
        <PMenu :model="menuItems" class="border-0 bg-transparent text-slate-100" />
        <PButton
          class="mt-6 w-full"
          severity="secondary"
          label="Sair"
          icon="pi pi-sign-out"
          @click="logoutAdmin"
        />
      </aside>

      <section class="flex-1 space-y-6">
        <Breadcrumb
          v-if="breadcrumbItems.length"
          :model="breadcrumbItems"
          class="rounded-2xl border border-slate-800/60 bg-slate-900/70 px-4 py-2 text-sm text-slate-200 shadow-sm"
        />
        <RouterView />
      </section>
    </div>
  </div>
</template>
