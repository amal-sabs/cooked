import { Button } from "@/components/ui/button"
import { getRecipe } from "@/hooks/queries/recipeQueries"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { useParams } from "react-router"
import RecipeNotFound from "@/components/RecipeNotFound"
import { parseAsInteger, useQueryState } from "nuqs"
import { SidebarProvider } from "@/components/ui/sidebar"
import { InstructionSidebar } from "@/components/instructions/InstructionSidebar"
import { getIngredientsForStep } from "@/utils/ingredientUtils"
import { useEffect } from "react"

export type InstructionViewParams = {
  id: string
  step?: string
}

export default function InstructionView() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))

  const params = useParams<InstructionViewParams>()

  const recipe = getRecipe(params.id)

  if (!recipe) {
    return <RecipeNotFound />
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }
    if (
      event.key.toLowerCase() === "arrowright" ||
      event.key.toLowerCase() === "arrowdown"
    ) {
      setStep((currentStep) =>
        Math.min(currentStep + 1, recipe.directions.length)
      )
    }
    if (
      event.key.toLowerCase() === "arrowleft" ||
      event.key.toLowerCase() === "arrowup"
    ) {
      setStep((currentStep) => Math.max(currentStep - 1, 1))
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const currentStepIndex = Math.min(Math.max(step, 1), recipe.directions.length)
  const currentStepText = recipe.directions[currentStepIndex - 1] ?? ""
  const visibleIngredients = getIngredientsForStep(
    currentStepText,
    recipe.ingredients
  )

  if (step > recipe.directions.length || step < 1) {
    setStep(1)
  }

  const getPreviousButtonText = () => {
    if (step > 1) {
      return recipe.directions[step - 2] ?? "Previous"
    }
    return "Back to recipe preview"
  }
  const getNextButtonText = () => {
    if (step < recipe.directions.length) {
      return recipe.directions[step] ?? "Next"
    }
    return "Finished! Back to recipe preview"
  }

  const handlePreviousClick = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  const handleNextClick = () => {
    if (step < recipe.directions.length) {
      setStep(step + 1)
    }
  }

  return (
    <SidebarProvider>
      <InstructionSidebar recipe={recipe} />
      <div className="flex h-screen w-full">
        {/* main content */}
        <main className="relative flex h-full flex-1 flex-col">
          {/* header */}
          <header className="flex items-center justify-between p-4 md:p-8">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon-lg">
                <ChevronLeft />
              </Button>
              <h2 className="text-xl font-medium md:text-2xl">
                Making: {recipe.name}
              </h2>
            </div>
            <Button variant="outline" size={"icon-lg"} className="md:hidden">
              <Menu />
            </Button>
          </header>

          <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 md:items-center md:p-8">
            <div className="flex min-h-[50vh] w-full max-w-4xl flex-col rounded-2xl bg-accent p-6 md:min-h-100 md:p-12">
              <div className="flex gap-4 md:gap-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-medium text-white">
                  {currentStepIndex}
                </div>
                <p className="mt-2 text-xl leading-relaxed md:text-2xl">
                  {currentStepText}
                </p>
              </div>

              {visibleIngredients.length > 0 && (
                <div className="mt-auto pt-12">
                  <p className="font-mediu mb-3 text-sm md:text-base">
                    Ingredients used in this step
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {visibleIngredients.map((ingredient) => (
                      <span
                        key={ingredient.templateNameVar}
                        className="rounded-full border border-gray-400 px-5 py-1.5 text-sm"
                      >
                        {ingredient.amount} {ingredient.unit} {ingredient.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="hidden justify-center p-6 md:flex md:pb-10">
            <div className="flex w-full max-w-4xl items-center justify-between rounded-full bg-accent px-6 py-4">
              <Button
                variant="ghost"
                onClick={handlePreviousClick}
                className="max-w-[40%]"
              >
                <ChevronLeft />
                <span className="truncate">{getPreviousButtonText()}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={handleNextClick}
                className="max-w-[40%]"
              >
                <span className="truncate">{getNextButtonText()}</span>
                <ChevronRight />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
