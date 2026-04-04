import RecipeNotFound from "@/components/RecipeNotFound"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import cookedLogo from "@/assets/cooked.svg"
import { getRecipe } from "@/hooks/queries/recipeQueries"
import { formatIngredientAmount } from "@/utils/ingredientUtils"
import { ArrowLeft } from "lucide-react"
import { useMemo } from "react"
import { useNavigate, useParams } from "react-router"

type RecipeViewParams = {
  id: string
}

export default function RecipeView() {
  const navigate = useNavigate()
  const params = useParams<RecipeViewParams>()
  const recipe = getRecipe(params.id)

  const displayRating = useMemo(() => {
    if (!recipe) {
      return "-"
    }

    return Number.isFinite(recipe.rating) ? recipe.rating.toFixed(1) : "-"
  }, [recipe])

  if (!recipe) {
    return <RecipeNotFound />
  }

  return (
    <div className="flex min-h-svh w-full items-start justify-center bg-muted px-3 py-3 md:px-8 md:py-6">
      <main className="w-full max-w-6xl rounded-3xl border border-border/60 bg-background shadow-sm">
        <header className="relative flex items-center justify-center border-b border-border/70 px-6 py-6">
          <h1 className="flex items-center gap-2 text-4xl font-semibold tracking-tight text-foreground">
            cooked
            <img src={cookedLogo} alt="Cooked logo" className="h-7 w-auto" />
          </h1>
        </header>

        <section className="p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1fr_2fr] md:items-start">
            <div className="space-y-6">
              <Button
                variant="secondary"
                size="icon-lg"
                className="rounded-full"
                onClick={() => navigate("/search")}
                aria-label="Back to search"
              >
                <ArrowLeft />
              </Button>

              <img
                src={recipe.image}
                alt={recipe.name}
                className="aspect-[4/3] w-full rounded-3xl object-cover"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-semibold leading-tight md:text-5xl">
                {recipe.name}
              </h2>

              <div className="grid gap-3 text-lg font-medium text-foreground/90 sm:grid-cols-2">
                <p>
                  Prep Time: <span className="font-normal">{recipe.prepTime}</span>
                </p>
                <p>
                  Servings: <span className="font-normal">{recipe.servings}</span>
                </p>
                <p>
                  Cook Time: <span className="font-normal">{recipe.cookTime}</span>
                </p>
                <p>
                  Yield: <span className="font-normal">{recipe.yield}</span>
                </p>
                <p>
                  Total Time: <span className="font-normal">{recipe.totalTime}</span>
                </p>
                <p>
                  Rating: <span className="font-normal">{displayRating}</span>
                </p>
              </div>

              <Button
                size="lg"
                className="mt-2"
                onClick={() => navigate(`/recipe/${params.id}/instructions`)}
              >
                Start cooking
              </Button>
            </div>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <section>
              <h3 className="mb-5 text-3xl font-semibold">Ingredients</h3>
              <ul className="space-y-4">
                {recipe.ingredients.map((ingredient) => {
                  const ingredientAmount = formatIngredientAmount(ingredient.amount)
                  const ingredientText = [
                    ingredientAmount,
                    ingredient.unit,
                    ingredient.name,
                  ]
                    .filter(Boolean)
                    .join(" ")

                  return (
                    <li
                      key={ingredient.templateNameVar}
                      className="flex items-start gap-3 text-lg"
                    >
                      <Checkbox aria-label={`Mark ${ingredient.name} as ready`} />
                      <span>{ingredientText}</span>
                    </li>
                  )
                })}
              </ul>
            </section>

            <section>
              <h3 className="mb-5 text-3xl font-semibold">Instructions</h3>
              <ol className="space-y-4">
                {recipe.directions.map((direction, index) => (
                  <li
                    key={`${recipe.name}-${index}`}
                    className="flex items-start gap-4 text-lg"
                  >
                    <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground/70 text-sm font-semibold text-background">
                      {index + 1}
                    </span>
                    <span>{direction}</span>
                  </li>
                ))}
              </ol>
            </section>
          </div>
        </section>
      </main>
    </div>
  )
}
