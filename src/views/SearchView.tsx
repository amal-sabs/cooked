import { getRecipeList} from '@/hooks/queries/recipeQueries';
import RecipeOverview from '@/components/search/RecipeOverview';
import SearchBar from '@/components/search/SearchBar';
import CategoryFilter from '@/components/search/CategoryFilter'; 
import { Separator } from '@/components/ui/separator';
import { useRecipeFilter } from '@/hooks/useRecipeFilter';

export default function SearchView() {
  const recipeList = getRecipeList();
  const { setSearchTerm, activeCategory, setActiveCategory, availableCategories, filteredRecipes } = useRecipeFilter(recipeList);

const displayCategories = [
  // eslint-disable-next-line react-hooks/purity
  { name: '✨ For You', recipes: [...filteredRecipes].sort(() => Math.random() - 0.5).slice(0, 5) },
  { name: '🔥 Hot Items', recipes: [...filteredRecipes].sort((a, b) => b.rating - a.rating).slice(0, 5) },
  { name: '📈 Popular Dishes', recipes: [...filteredRecipes].sort((a, b) => b.servings - a.servings).slice(0, 5) },
];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Recipes</h1>
      <div className="flex flex-col gap-4 mb-6">
        <SearchBar onSearch={setSearchTerm} />
        <CategoryFilter categories={availableCategories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
      </div>
      <Separator className="mb-8" />
      <RecipeOverview categories={displayCategories} />
    </div>
  );
}