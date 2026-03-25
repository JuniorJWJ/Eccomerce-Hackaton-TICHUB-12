import { reactive } from '@vue/reactivity'

export type SortOption = 'relevance' | 'price-asc' | 'price-desc' | 'stock-desc'

export const uiState = reactive({
  searchTerm: '',
  minPrice: 0,
  maxPrice: 0,
  sortBy: 'relevance' as SortOption,
  inStockOnly: false,
})
