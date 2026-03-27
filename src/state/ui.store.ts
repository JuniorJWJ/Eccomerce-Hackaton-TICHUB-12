import { reactive } from '@vue/reactivity'

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'stock-desc'

export type ToastType = 'info' | 'success' | 'warning' | 'error'

export const uiState = reactive({
  searchTerm: '',
  minPrice: 0,
  maxPrice: 0,
  sortBy: 'relevance' as SortOption,
  inStockOnly: false,
  loadingProducts: false,
  toastMessage: '',
  toastType: 'info' as ToastType,
  adminPreviewMode: false,
})

let toastTimer: number | undefined

export function showToast(message: string, type: ToastType = 'info'): void {
  uiState.toastMessage = message
  uiState.toastType = type
  if (toastTimer) {
    clearTimeout(toastTimer)
  }
  toastTimer = window.setTimeout(() => {
    uiState.toastMessage = ''
  }, 2600)
}
