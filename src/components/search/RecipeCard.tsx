import { Card, CardContent, CardTitle } from '@/components/ui/card';
import StarRating from './StarRating';
import type { RecipeModel } from '@/hooks/queries/recipeQueries';
import { useNavigate } from 'react-router';

type RecipeCardProps = {
  recipe: RecipeModel
  to: string
}

export default function RecipeCard({ recipe, to }: RecipeCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer overflow-hidden pt-0 transition-shadow hover:shadow-md"
      role="button"
      onClick={() => navigate(to)}
    >
      <img
        src={recipe.image}
        alt={recipe.name}
        className="h-52 w-full rounded-t-xl object-cover object-center"
      />
      <CardContent className="p-4">
        <CardTitle className="mb-2 line-clamp-1">{recipe.name}</CardTitle>
        <p className="text-gray-600 mb-2">Prep: {recipe.prepTime} | Cook: {recipe.cookTime || recipe.totalTime}</p>
        <p className="text-gray-600 mb-2">Servings: {recipe.servings}</p>
        <StarRating rating={recipe.rating} />
      </CardContent>
    </Card>
  );
}