import { useState, useMemo } from 'react';
import type { RecipeModel } from '@/hooks/queries/recipeQueries';
import { CATEGORY_ORDER, type RecipeCategory } from '@/lib/categoryConfig';

export function useRecipeFilter(recipeList: RecipeModel[]) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

const availableCategories = Array.from(new Set(recipeList.flatMap(r => r.categories ?? []).filter(Boolean)))
  .sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a as RecipeCategory);
    const bIndex = CATEGORY_ORDER.indexOf(b as RecipeCategory);
    return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
  });
  
  const filteredRecipes = useMemo(() => recipeList.filter(recipe => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || recipe.categories?.includes(activeCategory);
    return matchesSearch && matchesCategory;
  }), [recipeList, searchTerm, activeCategory]);

  return { searchTerm, setSearchTerm, activeCategory, setActiveCategory, availableCategories, filteredRecipes };
}