<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
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

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

type BreadcrumbItem = {
  label: string
  to?: string | { name: string }
}

export default defineComponent({
  name: 'ConsumerLayout',
  components: {
    Menubar,
    Breadcrumb,
    PButton,
    InputText,
    CartPanel,
    RouterView,
  },
  data() {
    return {
      isDark: false,
      isMobileMenuOpen: false,
      isUserMenuOpen: false,
      cartState,
      authState,
      uiState,
      Role,
    }
  },
  computed: {
    menuItems() {
      const items: { label: string; icon: string; command: () => void }[] = []

      if (this.authState.isAuthenticated) {
        items.push({
          label: 'Finalizar compra',
          icon: 'pi pi-shopping-cart',
          command: () => this.goToCheckout(),
        })
      }

      // if (this.authState.role === Role.ADMIN) {
      //   items.push({
      //     label: 'Admin',
      //     icon: 'pi pi-shield',
      //     command: () => this.goToAdmin(),
      //   })
      // }

      return items
    },
    breadcrumbItems(): BreadcrumbItem[] {
      const metaItems = (this.$route.meta.breadcrumb as BreadcrumbItem[] | undefined) ?? []
      const items = metaItems.map((item) => ({ ...item }))

      if (this.$route.name === 'product-details') {
        const productId = Number(this.$route.params.id)
        const product = getProductById(productId)
        if (product && items.length > 0) {
          items[items.length - 1].label = product.name
        }
      }

      return items
    },
    totalItems(): number {
      return this.cartState.cart.getTotalItems()
    },
    totalPrice(): number {
      return this.cartState.cart.getFinalPrice()
    },
    roleLabel(): string {
      return this.authState.role === Role.ADMIN ? 'ADMIN' : 'CLIENTE'
    },
    authButtonLabel(): string {
      return this.authState.isAuthenticated ? `Sair (${this.roleLabel})` : 'Entrar'
    },
  },
  methods: {
    goToCheckout(): void {
      if (!this.authState.isAuthenticated) {
        this.$router.push({ name: 'login', query: { redirect: 'checkout' } })
        return
      }
      this.$router.push({ name: 'checkout' })
    },
    goToAdmin(): void {
      if (this.authState.role !== Role.ADMIN) {
        this.$router.push({ name: 'login', query: { redirect: 'admin-products', role: 'admin' } })
        return
      }
      this.$router.push({ name: 'admin-products' })
    },
    goToProfile(): void {
      if (!this.authState.isAuthenticated) {
        this.$router.push({ name: 'login', query: { redirect: 'profile' } })
        return
      }
      this.$router.push({ name: 'profile' })
    },
    toggleDark(): void {
      this.isDark = !this.isDark
    },
    toggleMobileMenu(): void {
      this.isMobileMenuOpen = !this.isMobileMenuOpen
    },
    closeMobileMenu(): void {
      this.isMobileMenuOpen = false
    },
    toggleUserMenu(): void {
      this.isUserMenuOpen = !this.isUserMenuOpen
    },
    closeUserMenu(): void {
      this.isUserMenuOpen = false
    },
    formatPrice(value: number): string {
      return currencyFormatter.format(value)
    },
    goToLogin(): void {
      this.$router.push({ name: 'login' })
    },
    goToRegister(): void {
      this.$router.push({ name: 'register' })
    },
    logoutUser(): void {
      logout()
    },
  },
})
</script>

<template>
  <div :class="{ dark: isDark }">
    <div
      class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100"
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
                @click="$router.push({ name: 'home' })"
                @keydown.enter.prevent="$router.push({ name: 'home' })"
                @keydown.space.prevent="$router.push({ name: 'home' })"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm dark:bg-slate-100 dark:text-slate-900"
                >
                  LP
                </div>
                <div>
                  <p
                    class="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400"
                  >
                    Loja PrimeVue
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Ecommerce Studio
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
                class="hidden items-center gap-3 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-100 lg:flex"
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
                <PButton
                  size="small"
                  icon="pi pi-user"
                  severity="secondary"
                  @click="toggleUserMenu"
                />
                <div
                  v-if="isUserMenuOpen"
                  class="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg"
                >
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

        <main
          class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]"
        >
          <section>
            <RouterView />
          </section>
          <section class="lg:justify-self-end lg:w-[360px] xl:w-[400px]">
            <CartPanel :cart="cartState.cart" />
          </section>
        </main>
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
