import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from './StarRating';
import type { RecipeModel } from '@/hooks/queries/recipeQueries';

export default function RecipeCard({ recipe }: { recipe: RecipeModel }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img src={recipe.image} alt={recipe.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1">{recipe.name}</CardTitle>
        <p className="text-gray-600 mb-2">Prep: {recipe.prepTime} | Cook: {recipe.cookTime || recipe.totalTime}</p>
        <p className="text-gray-600 mb-2">Servings: {recipe.servings}</p>
        <StarRating rating={recipe.rating} />
      </CardContent>
    </Card>
  );
}