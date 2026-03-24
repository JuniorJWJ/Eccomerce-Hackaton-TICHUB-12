<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import PButton from 'primevue/button'
import { getMockUsers, loginWithCredentials } from '../../state/auth.store'

const email = ref('')
const password = ref('')
const error = ref('')
const route = useRoute()
const router = useRouter()
const mockUsers = getMockUsers()

function handleLogin(): void {
  error.value = ''
  const result = loginWithCredentials(email.value, password.value)
  if (!result.ok) {
    error.value = result.message ?? 'Não foi possível entrar.'
    return
  }

  const redirectName = typeof route.query.redirect === 'string' ? route.query.redirect : 'home'
  const target = router.hasRoute(redirectName) ? redirectName : 'home'
  router.push({ name: target })
}
</script>

<template>
  <Card class="rounded-2xl border border-slate-200/70 bg-white/95 p-6 shadow-sm">
    <template #content>
      <div class="flex flex-col gap-6">
        <div>
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Acesso</p>
          <h2 class="text-2xl font-semibold">Entrar</h2>
          <p class="mt-2 text-sm text-slate-500">
            Use as contas de teste abaixo ou faça seu cadastro.
          </p>
        </div>

        <div
          v-if="error"
          class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {{ error }}
        </div>

        <div class="grid gap-4">
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-600">E-mail</label>
            <InputText v-model="email" placeholder="seuemail@exemplo.com" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-600">Senha</label>
            <InputText v-model="password" type="password" placeholder="••••••" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <PButton label="Entrar" icon="pi pi-sign-in" @click="handleLogin" />
          <RouterLink class="text-sm text-slate-500 hover:text-slate-700" :to="{ name: 'register' }">
            Criar conta
          </RouterLink>
        </div>

        <div class="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Contas mockadas</p>
          <ul class="mt-2 space-y-2">
            <li v-for="user in mockUsers" :key="user.id" class="flex flex-col">
              <span class="font-semibold">{{ user.name }} ({{ user.role }})</span>
              <span>{{ user.email }} | Senha: {{ user.password }}</span>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </Card>
</template>
