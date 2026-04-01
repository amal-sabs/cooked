import { Button } from "@/components/ui/button"
import { getRecipe } from "@/hooks/queries/recipeQueries"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useParams } from "react-router"
import RecipeNotFound from "@/components/RecipeNotFound"
import { parseAsInteger, useQueryState } from "nuqs"
import { SidebarProvider } from "@/components/ui/sidebar"
import { InstructionSidebar } from "@/components/InstructionSidebar"

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

  const currentStepIndex = Math.min(Math.max(step, 1), recipe.directions.length)
  const currentStepText = recipe.directions[currentStepIndex - 1] ?? ""
  const visibleIngredients = recipe.ingredients

  if (step > recipe.directions.length || step < 1) {
    setStep(1)
  }

  const getPreviousButtonText = () => {
    return "previous"
  }
  const getNextButtonText = () => {
    return "next"
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
      <InstructionSidebar recipe={recipe} currentStep={step} />
      <div className="flex h-screen w-full bg-white font-sans text-gray-900">
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
            {/* Mobile Menu Icon - Hidden on desktop */}
            <button className="p-2 text-2xl md:hidden">☰</button>
          </header>

          <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 md:items-center md:p-8">
            <div className="flex min-h-[50vh] w-full max-w-4xl flex-col rounded-2xl bg-[#E5E5E5] p-6 md:min-h-[400px] md:p-12">
              <div className="flex gap-4 md:gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-xl font-medium text-white">
                  {currentStepIndex}
                </div>
                <p className="mt-2 text-xl leading-relaxed text-gray-900 md:text-2xl">
                  {currentStepText}
                </p>
              </div>

              <div className="mt-auto pt-12">
                <p className="mb-3 text-sm font-medium text-gray-800 md:text-base">
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
            </div>
          </div>

          <div className="hidden justify-center p-6 md:flex md:pb-10">
            <div className="flex w-full max-w-4xl items-center justify-between rounded-full bg-[#E5E5E5] px-6 py-4">
              <Button variant="ghost" onClick={handlePreviousClick}>
                <ChevronLeft />
                {getPreviousButtonText()}
              </Button>
              <Button variant="ghost" onClick={handleNextClick}>
                {getNextButtonText()}
                <ChevronRight />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
