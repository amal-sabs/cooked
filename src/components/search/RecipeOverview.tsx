import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import RecipeCard from './RecipeCard';
import { getRecipeList, type RecipeModel } from '@/hooks/queries/recipeQueries';
import { useState, useEffect } from 'react';

interface RecipeCategory {
  name: string;
  recipes: RecipeModel[];
}

export default function RecipeOverview({ categories }: { categories: RecipeCategory[] }) {
  const recipeList = getRecipeList();

  const [apis, setApis] = useState<Record<string, CarouselApi>>({});

  useEffect(() => {
    Object.values(apis).forEach(api => api?.scrollTo(0));
  }, [categories, apis]);

  return (
    <div>
      {categories.map((category) => (
        <div key={category.name} className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">{category.name}</h2>
          <Carousel
            className="w-full"
            opts={{ align: "start", loop: true, containScroll: false }}
            setApi={(api) => setApis(prev => ({ ...prev, [category.name]: api }))}
          >
            <CarouselContent viewportClassName="pt-2 pb-2 px-2">
              {category.recipes.map((recipe) => {
                const recipeIndex = recipeList.findIndex((item) => item.url === recipe.url)
                const recipePath = recipeIndex >= 0 ? `/recipe/${recipeIndex}` : "/search"

                return (
                  <CarouselItem key={`${category.name}-${recipe.url}`} className="basis-4/5 md:basis-1/3 lg:basis-1/4">
                    <RecipeCard recipe={recipe} to={recipePath} />
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      ))}
    </div>
  );
}