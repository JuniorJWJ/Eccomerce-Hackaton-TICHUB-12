<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Card from 'primevue/card'
import InputText from 'primevue/inputtext'
import PButton from 'primevue/button'
import { registerUser } from '../../state/auth.store'

const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const route = useRoute()
const router = useRouter()

function handleRegister(): void {
  error.value = ''
  const result = registerUser({
    name: name.value,
    email: email.value,
    password: password.value,
  })

  if (!result.ok) {
    error.value = result.message ?? 'Não foi possível cadastrar.'
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
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">Cadastro</p>
          <h2 class="text-2xl font-semibold">Criar conta</h2>
          <p class="mt-2 text-sm text-slate-500">
            Preencha seus dados e comece a comprar.
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
            <label class="text-sm font-medium text-slate-600">Nome completo</label>
            <InputText v-model="name" placeholder="Seu nome" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-600">E-mail</label>
            <InputText v-model="email" placeholder="seuemail@exemplo.com" />
          </div>
          <div class="grid gap-2">
            <label class="text-sm font-medium text-slate-600">Senha</label>
            <InputText v-model="password" type="password" placeholder="Mínimo 6 caracteres" />
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-3">
          <PButton label="Cadastrar" icon="pi pi-user-plus" @click="handleRegister" />
          <RouterLink class="text-sm text-slate-500 hover:text-slate-700" :to="{ name: 'login' }">
            Já tenho conta
          </RouterLink>
        </div>
      </div>
    </template>
  </Card>
</template>
