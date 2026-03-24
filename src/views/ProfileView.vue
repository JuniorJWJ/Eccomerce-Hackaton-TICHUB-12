<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import Card from 'primevue/card'
import PButton from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import Textarea from 'primevue/textarea'
import { authState, updateProfile } from '../state/auth.store'

const profile = computed(() => authState.profile)

const name = ref(profile.value.name)
const email = ref(profile.value.email)
const phone = ref(profile.value.phone)
const address = ref(profile.value.address)
const city = ref(profile.value.city)
const state = ref(profile.value.state)
const zip = ref(profile.value.zip)
const photoUrl = ref(profile.value.photoUrl)

const saved = ref(false)

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
              <p class="text-xs text-slate-500">Essa imagem aparecerá no seu perfil.</p>
            </div>
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
  </div>
</template>
