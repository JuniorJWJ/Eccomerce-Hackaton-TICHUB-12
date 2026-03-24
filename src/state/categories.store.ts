import { reactive } from '@vue/reactivity'
import { Category } from '../model/category.model'

export const categoryState = reactive({
  categories: [
    new Category(1, 'Suplementos'),
    new Category(2, 'Hardware'),
    new Category(3, 'Roupa'),
  ],
})

export function getNextCategoryId(): number {
  const ids = categoryState.categories.map((category) => category.id)
  return ids.length ? Math.max(...ids) + 1 : 1
}

export function addCategory(title: string): Category {
  const newCategory = new Category(getNextCategoryId(), title)
  categoryState.categories.push(newCategory)
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
  return true
}

export function removeCategory(id: number): boolean {
  const index = categoryState.categories.findIndex((item) => item.id === id)
  if (index === -1) {
    return false
  }
  categoryState.categories.splice(index, 1)
  return true
}
