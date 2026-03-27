/// <reference types="vite/client" />

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $confirm: import('primevue/confirmationservice').ConfirmationServiceMethods
  }
}

declare module 'vue' {
  export {
    createApp,
    defineComponent,
    computed,
    ref,
    reactive,
    watch,
    onMounted,
    onBeforeUnmount,
  } from '@vue/runtime-dom'
}
