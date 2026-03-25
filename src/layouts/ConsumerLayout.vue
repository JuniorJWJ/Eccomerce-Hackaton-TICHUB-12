<script lang="ts">
import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import Menubar from 'primevue/menubar'
import Breadcrumb from 'primevue/breadcrumb'
import PButton from 'primevue/button'
import Card from 'primevue/card'
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
    Card,
    InputText,
    CartPanel,
    RouterView,
  },
  data() {
    return {
      isDark: false,
      isMobileMenuOpen: false,
      cartState,
      authState,
      uiState,
      Role,
    }
  },
  computed: {
    menuItems() {
      const items = [
        {
          label: 'Início',
          icon: 'pi pi-home',
          command: () => this.$router.push({ name: 'home' }),
        },
      ]

      if (this.authState.isAuthenticated) {
        items.push({
          label: 'Finalizar compra',
          icon: 'pi pi-shopping-cart',
          command: () => this.goToCheckout(),
        })
        items.push({
          label: 'Perfil',
          icon: 'pi pi-user',
          command: () => this.goToProfile(),
        })
      }

      if (this.authState.role === Role.ADMIN) {
        items.push({
          label: 'Admin',
          icon: 'pi pi-shield',
          command: () => this.goToAdmin(),
        })
      }

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
          class="rounded-3xl border border-slate-200/70 bg-white/90 px-2 py-1 text-slate-900 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-900/90 dark:text-slate-100"
        >
          <template #start>
            <div class="flex items-center gap-4">
              <div
                class="flex cursor-pointer items-center gap-3 px-3 py-2"
                role="button"
                tabindex="0"
                @click="$router.push({ name: 'home' })"
                @keydown.enter.prevent="$router.push({ name: 'home' })"
                @keydown.space.prevent="$router.push({ name: 'home' })"
              >
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                >
                  LP
                </div>
                <div>
                  <p class="text-[11px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-400">
                    Loja PrimeVue
                  </p>
                  <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Ecommerce Studio
                  </p>
                </div>
              </div>
              <div class="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 lg:flex dark:border-slate-700 dark:bg-slate-900">
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
              <Card
                class="hidden rounded-2xl border border-slate-200/70 bg-white/95 px-4 py-2 shadow-sm dark:border-slate-800/70 dark:bg-slate-900/80 lg:block"
              >
                <template #content>
                  <div class="flex items-center gap-4 text-sm text-slate-900 dark:text-slate-100">
                    <div>
                      <p class="text-[11px] uppercase text-slate-500 dark:text-slate-400">Itens</p>
                      <p class="font-semibold">{{ totalItems }}</p>
                    </div>
                    <div>
                      <p class="text-[11px] uppercase text-slate-500 dark:text-slate-400">Total</p>
                      <p class="font-semibold">{{ formatPrice(totalPrice) }}</p>
                    </div>
                  </div>
                </template>
              </Card>
              <PButton
                size="small"
                severity="secondary"
                :label="authButtonLabel"
                @click="authState.isAuthenticated ? logoutUser() : goToLogin()"
              />
              <PButton
                v-if="!authState.isAuthenticated"
                size="small"
                severity="help"
                label="Criar conta"
                @click="goToRegister"
              />
              <PButton
                v-if="authState.role === Role.ADMIN"
                size="small"
                severity="info"
                label="Admin"
                @click="goToAdmin"
              />
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
              <PButton label="Início" text @click="$router.push({ name: 'home' }); closeMobileMenu()" />
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
  </div>
</template>

