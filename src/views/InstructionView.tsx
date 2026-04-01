import { InstructionSidebar } from "@/components/instructions/InstructionSidebar"
import RecipeNotFound from "@/components/RecipeNotFound"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { getRecipe } from "@/hooks/queries/recipeQueries"
import { getIngredientsForStep } from "@/utils/ingredientUtils"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router"

export type InstructionViewParams = {
  id: string
  step?: string
}

function MobileSidebarToggleButton() {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      variant="outline"
      size="icon-lg"
      className="md:hidden"
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  )
}

export default function InstructionView() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const params = useParams<InstructionViewParams>()
  const navigate = useNavigate()

  const recipe = getRecipe(params.id)

  if (!recipe) {
    return <RecipeNotFound />
  }

  useEffect(() => {
    if (recipe.directions.length === 0) {
      return
    }

    const clampedStep = Math.min(Math.max(step, 1), recipe.directions.length)

    if (clampedStep !== step) {
      setStep(clampedStep)
    }
  }, [recipe.directions.length, setStep, step])

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
  }, [handleKeyDown])

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const nextSlideIndex = step - 1

    if (carouselApi.selectedScrollSnap() !== nextSlideIndex) {
      carouselApi.scrollTo(nextSlideIndex)
    }
  }, [carouselApi, step])

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    const handleSelect = () => {
      const selectedStep = carouselApi.selectedScrollSnap() + 1
      if (selectedStep !== step) {
        setStep(selectedStep)
      }
    }

    handleSelect()
    carouselApi.on("select", handleSelect)
    carouselApi.on("reInit", handleSelect)

    return () => {
      carouselApi.off("select", handleSelect)
      carouselApi.off("reInit", handleSelect)
    }
  }, [carouselApi, setStep, step])

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

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <InstructionSidebar recipe={recipe} />
        <main className="relative flex h-full min-w-0 flex-1 flex-col">
          <header className="flex w-full items-center justify-between p-4 md:p-8">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon-lg"
                onClick={() => {
                  navigate(`/recipe/${params.id}`)
                }}
              >
                <ChevronLeft />
              </Button>
              <h2 className="text-xl font-medium md:text-2xl">
                Making: {recipe.name}
              </h2>
            </div>
            <MobileSidebarToggleButton />
          </header>

          <div className="flex min-w-0 flex-1 items-start justify-center overflow-y-auto p-4 md:items-center md:p-8">
            <Carousel
              className="w-full min-w-0 h-full"
              opts={{ align: "center", containScroll: false }}
              setApi={setCarouselApi}
            >
              <CarouselContent viewportClassName="h-full" className="h-full">
                {recipe.directions.map((direction, index) => {
                  const stepIngredients = getIngredientsForStep(
                    direction,
                    recipe.ingredients
                  )

                  return (
                    <CarouselItem
                      className={"basis-6/7 select-none md:basis-6/7"}
                      key={`${recipe.name}-${index}`}
                    >
                      <div className="flex h-full flex-col rounded-4xl bg-accent p-6 md:min-h-100 md:p-12">
                        <div className="flex gap-4 md:gap-6">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-xl font-medium text-white">
                            {index + 1}
                          </div>
                          <p className="mt-2 text-xl leading-relaxed md:text-xl">
                            {direction}
                          </p>
                        </div>

                        {stepIngredients.length > 0 && (
                          <div className="mt-auto pt-12">
                            <p className="mb-3 text-sm font-medium md:text-base">
                              Ingredients used in this step
                            </p>
                            <div className="flex flex-wrap gap-3">
                              {stepIngredients.map((ingredient) => (
                                <span
                                  key={ingredient.templateNameVar}
                                  className="rounded-full border border-gray-400 px-5 py-1.5 text-sm"
                                >
                                  {ingredient.amount} {ingredient.unit}{" "}
                                  {ingredient.name}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="hidden justify-center p-6 md:flex md:pb-10">
            <div className="flex w-full items-center justify-between rounded-full bg-accent px-6 py-4">
              <Button
                variant="ghost"
                onClick={() =>
                  setStep((currentStep) => Math.max(currentStep - 1, 1))
                }
                className="max-w-[40%]"
              >
                <ChevronLeft />
                <span className="truncate">{getPreviousButtonText()}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() =>
                  setStep((currentStep) =>
                    Math.min(currentStep + 1, recipe.directions.length)
                  )
                }
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
