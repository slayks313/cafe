import { supabase } from './supabase'

export async function getCategories() {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error

  return data
}

export async function getMenuItems() {
  const { data, error } = await supabase
    .from('menu_items')
    .select(`
      *,
      menu_item_variants (
        id,
        name_ru,
        name_uz,
        name_en,
        price,
        sort_order
      )
    `)
    .eq('is_available', true)
    .order('sort_order', { ascending: true })

  if (error) throw error

  return data
}