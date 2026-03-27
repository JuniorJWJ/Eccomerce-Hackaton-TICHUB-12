<script lang="ts" setup>
import { computed, ref } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import Menubar from 'primevue/menubar'
import Breadcrumb from 'primevue/breadcrumb'
import PButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import { cartState } from '../state/cart.store'
import { authState, logout } from '../state/auth.store'
import { Role } from '../enums/Role'
import CartPanel from '../components/CartPanel.vue'
import { getProductById } from '../state/products.store'
import { uiState } from '../state/ui.store'
import logoUrl from '../assets/logohackshop.jpg'

const router = useRouter()
const route = useRoute()

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

const isDark = ref(false)
const isMobileMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const isCartOpen = ref(false)

const menuItems = computed(() => {
  const items: { label: string; icon: string; command: () => void }[] = []

  if (authState.isAuthenticated) {
    items.push({
      label: 'Finalizar compra',
      icon: 'pi pi-shopping-cart',
      command: () => goToCheckout(),
    })
  }

  return items
})

const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const metaItems = (route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []
  const items = metaItems.map((item) => ({ ...item }))

  if (route.name === 'product-details') {
    const productId = Number(route.params.id)
    const product = getProductById(productId)
    if (product && items.length > 0) {
      const last = items[items.length - 1]
      if (last) {
        last.label = product.name
      }
    }
  }

  return items
})

const totalItems = computed(() => cartState.cart.getTotalItems())
const totalPrice = computed(() => cartState.cart.getFinalPrice())
const roleLabel = computed(() => (authState.role === Role.ADMIN ? 'ADMIN' : 'CLIENTE'))
const authButtonLabel = computed(() =>
  authState.isAuthenticated ? `Sair (${roleLabel.value})` : 'Entrar',
)

function goToCheckout(): void {
  if (!authState.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: 'checkout' } })
    return
  }
  router.push({ name: 'checkout' })
}

function goToAdmin(): void {
  if (authState.role !== Role.ADMIN) {
    router.push({ name: 'login', query: { redirect: 'admin-products', role: 'admin' } })
    return
  }
  router.push({ name: 'admin-products' })
}

function goToProfile(): void {
  if (!authState.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: 'profile' } })
    return
  }
  router.push({ name: 'profile' })
}

function toggleDark(): void {
  isDark.value = !isDark.value
}

function toggleMobileMenu(): void {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMobileMenu(): void {
  isMobileMenuOpen.value = false
}

function toggleUserMenu(): void {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

function closeUserMenu(): void {
  isUserMenuOpen.value = false
}

function toggleCart(): void {
  isCartOpen.value = !isCartOpen.value
}

function closeCart(): void {
  isCartOpen.value = false
}

function formatPrice(value: number): string {
  return currencyFormatter.format(value)
}

function goToLogin(): void {
  router.push({ name: 'login' })
}

function goToRegister(): void {
  router.push({ name: 'register' })
}

function logoutUser(): void {
  logout()
}
</script>

<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-gradient-to-br from-[#f7f3ef] via-[#f5f6fb] to-[#eef2ff] text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
    >
      <div class="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-8">
        <Menubar
          :model="menuItems"
          class="sticky top-4 z-40 rounded-[28px] border border-slate-200/70 bg-white/90 px-3 py-2 text-slate-900 shadow-md backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/90 dark:text-slate-100"
        >
          <template #start>
            <div class="flex items-center gap-5">
              <div
                class="flex cursor-pointer items-center gap-3 px-3 py-1.5"
                role="button"
                tabindex="0"
                @click="router.push({ name: 'home' })"
                @keydown.enter.prevent="router.push({ name: 'home' })"
                @keydown.space.prevent="router.push({ name: 'home' })"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm"
                >
                  <img :src="logoUrl" alt="Loja PrimeVue" class="h-10 w-10" />
                </div>
                <div>
                  <p
                    class="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400"
                  >
                    HackShop
                  </p>
                </div>
              </div>
              <div
                class="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 lg:flex dark:border-slate-700 dark:bg-slate-900"
              >
                <i class="pi pi-search text-xs text-slate-400 dark:text-slate-500" />
                <InputText
                  v-model="uiState.searchTerm"
                  placeholder="Buscar produtos"
                  class="border-0 bg-transparent text-sm text-slate-900 shadow-none focus:ring-0 dark:text-slate-100"
                />
              </div>
            </div>
          </template>
          <template #end>
            <div class="flex flex-wrap items-center gap-2 px-2">
              <PButton
                size="small"
                icon="pi pi-bars"
                class="lg:hidden"
                severity="secondary"
                aria-label="Abrir menu"
                @click="toggleMobileMenu"
              />
              <div
                class="hidden cursor-pointer items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-slate-700 lg:flex"
                role="button"
                tabindex="0"
                @click="toggleCart"
                @keydown.enter.prevent="toggleCart"
                @keydown.space.prevent="toggleCart"
              >
                <span
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  {{ totalItems }}
                </span>
                <div>
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400">Carrinho</p>
                  <p class="font-semibold">{{ formatPrice(totalPrice) }}</p>
                </div>
              </div>
              <div class="relative">
                <PButton size="small" icon="pi pi-user" severity="secondary" @click="toggleUserMenu" />
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                >
                  <PButton
                    v-if="authState.isAuthenticated"
                    label="Meus pedidos"
                    text
                    class="w-full justify-start"
                    @click="router.push({ name: 'orders' }); closeUserMenu()"
                  />
                  <PButton
                    v-if="!authState.isAuthenticated"
                    label="Entrar"
                    text
                    class="w-full justify-start"
                    @click="goToLogin(); closeUserMenu()"
                  />
                  <PButton
                    v-if="!authState.isAuthenticated"
                    label="Criar conta"
                    text
                    class="w-full justify-start"
                    @click="goToRegister(); closeUserMenu()"
                  />
                  <PButton
                    v-if="authState.isAuthenticated"
                    label="Perfil"
                    text
                    class="w-full justify-start"
                    @click="goToProfile(); closeUserMenu()"
                  />
                  <PButton
                    v-if="authState.role === Role.ADMIN"
                    label="Admin"
                    text
                    class="w-full justify-start"
                    @click="goToAdmin(); closeUserMenu()"
                  />
                  <PButton
                    v-if="authState.isAuthenticated"
                    :label="authButtonLabel"
                    text
                    class="w-full justify-start"
                    @click="logoutUser(); closeUserMenu()"
                  />
                </div>
              </div>
              <PButton
                size="small"
                :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
                :label="isDark ? 'Claro' : 'Escuro'"
                severity="secondary"
                @click="toggleDark"
              />
            </div>
          </template>
        </Menubar>

        <div
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          @click="closeMobileMenu"
        >
          <div
            class="absolute right-4 top-4 w-[280px] rounded-3xl border border-slate-200/70 bg-white p-4 shadow-xl"
            @click.stop
          >
            <div class="flex items-center justify-between">
              <p class="text-sm font-semibold text-slate-900">Menu</p>
              <PButton icon="pi pi-times" text @click="closeMobileMenu" />
            </div>
            <div class="mt-4 flex flex-col gap-2">
              <PButton
                v-if="authState.isAuthenticated"
                label="Finalizar compra"
                text
                @click="goToCheckout(); closeMobileMenu()"
              />
              <PButton
                v-if="authState.isAuthenticated"
                label="Meus pedidos"
                text
                @click="router.push({ name: 'orders' }); closeMobileMenu()"
              />
              <PButton
                v-if="authState.isAuthenticated"
                label="Perfil"
                text
                @click="goToProfile(); closeMobileMenu()"
              />
              <PButton
                v-if="authState.role === Role.ADMIN"
                label="Admin"
                text
                @click="goToAdmin(); closeMobileMenu()"
              />
              <PButton
                :label="authButtonLabel"
                text
                @click="authState.isAuthenticated ? logoutUser() : goToLogin(); closeMobileMenu()"
              />
              <PButton
                v-if="!authState.isAuthenticated"
                label="Criar conta"
                text
                @click="goToRegister(); closeMobileMenu()"
              />
            </div>
          </div>
        </div>

        <Breadcrumb
          v-if="breadcrumbItems.length"
          :model="breadcrumbItems"
          class="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-2 text-sm shadow-sm"
        />

        <div
          v-if="uiState.adminPreviewMode && authState.role === Role.ADMIN"
          class="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-700"
        >
          Modo vitrine ativo: você está vendo a loja como um cliente.
        </div>

        <main>
          <RouterView />
        </main>
      </div>
    </div>

    <div
      v-if="isCartOpen"
      class="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm"
      @click="closeCart"
    >
      <div
        class="absolute right-4 top-4 flex h-[calc(100vh-32px)] w-[360px] max-w-[90vw] flex-col overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-4 shadow-2xl"
        @click.stop
      >
        <div class="flex items-center justify-between">
          <p class="text-sm font-semibold text-slate-900">Seu carrinho</p>
          <PButton icon="pi pi-times" text @click="closeCart" />
        </div>
        <div class="mt-4 flex-1 min-h-0 overflow-y-auto">
          <CartPanel :cart="cartState.cart" />
        </div>
      </div>
    </div>

    <div
      v-if="uiState.toastMessage"
      class="fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm text-white shadow-lg"
      :class="{
        'bg-slate-900': uiState.toastType === 'info',
        'bg-emerald-600': uiState.toastType === 'success',
        'bg-amber-500': uiState.toastType === 'warning',
        'bg-rose-600': uiState.toastType === 'error',
      }"
    >
      {{ uiState.toastMessage }}
    </div>
  </div>
</template>
