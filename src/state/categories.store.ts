import { reactive } from '@vue/reactivity'
import { Category } from '../model/category.model'

const STORAGE_KEY = 'loja_categories'

function loadCategories(): Category[] {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    return [
      new Category(1, 'Suplementos'),
      new Category(2, 'Hardware'),
      new Category(3, 'Roupa'),
    ]
  }

  try {
    const parsed = JSON.parse(raw) as { id: number; title: string }[]
    return parsed.map((item) => new Category(item.id, item.title))
  } catch {
    return [
      new Category(1, 'Suplementos'),
      new Category(2, 'Hardware'),
      new Category(3, 'Roupa'),
    ]
  }
}

function saveCategories(categories: Category[]): void {
  const payload = categories.map((category) => ({
    id: category.id,
    title: category.title,
  }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export const categoryState = reactive({
  categories: loadCategories(),
})

export function getNextCategoryId(): number {
  const ids = categoryState.categories.map((category) => category.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

export function addCategory(title: string): Category {
  const newCategory = new Category(getNextCategoryId(), title)
  categoryState.categories.push(newCategory)
  saveCategories(categoryState.categories)
  return newCategory
}

export function updateCategory(id: number, title: string): boolean {
  const category = categoryState.categories.find((item) => item.id === id)
  if (!category) {
    return false
  }
  if (!title.trim()) {
    return false
  }
  category.title = title.trim()
  saveCategories(categoryState.categories)
  return true
}

export function removeCategory(id: number): boolean {
  const index = categoryState.categories.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }
  categoryState.categories.splice(index, 1)
  saveCategories(categoryState.categories)
  return true
}
