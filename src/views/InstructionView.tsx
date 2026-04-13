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
import {
  formatIngredientAmount,
  getIngredientsForStep,
} from "@/utils/ingredientUtils"
import { ChevronLeft, ChevronRight, Menu } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect, useMemo, useState } from "react"
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

// step-by-step view (this comment is useless i know i'm just trying to redeploy)
export default function InstructionView() {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null)

  const isMobile = globalThis.matchMedia("(max-width: 768px)").matches
  const isTapToNavigateEnabled = useMemo(() => {
    const settings = localStorage.getItem("cooked-instruction-view-settings")
    if (settings) {
      return JSON.parse(settings).navigationStyle === "tap"
    }
    return false
  }, [localStorage.getItem("cooked-instruction-view-settings")])

  const params = useParams<InstructionViewParams>()
  const navigate = useNavigate()

  const recipe = getRecipe(params.id)
  const recipeServings = recipe?.servings ?? 1
  const directionsLength = recipe?.directions.length ?? 0

  const [servingCount, _] = useQueryState(
    "servings",
    parseAsInteger.withDefault(recipeServings)
  )
  const servingMultiplier = servingCount / recipeServings

  useEffect(() => {
    if (directionsLength === 0) {
      return
    }

    const clampedStep = Math.min(Math.max(step, 1), directionsLength)

    if (clampedStep !== step) {
      setStep(clampedStep)
    }
  }, [directionsLength, setStep, step])

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
      setStep((currentStep) => Math.min(currentStep + 1, directionsLength))
    }
    if (
      event.key.toLowerCase() === "arrowleft" ||
      event.key.toLowerCase() === "arrowup"
    ) {
      setStep((currentStep) => Math.max(currentStep - 1, 1))
    }
  }

  useEffect(() => {
    globalThis.addEventListener("keydown", handleKeyDown)
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown)
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
    if (!recipe) {
      return "Previous"
    }

    if (step > 1) {
      return recipe.directions[step - 2] ?? "Previous"
    }
    return "Back to recipe preview"
  }
  const getNextButtonText = () => {
    if (!recipe) {
      return "Next"
    }

    if (step < recipe.directions.length) {
      return recipe.directions[step] ?? "Next"
    }
    return "Finished! Back to recipe preview"
  }

  const goToPreviousStep = (sideTap?: boolean) => {
    if (step === 1 && !sideTap) {
      navigate(`/recipe/${params.id}`)
    }
    setStep((currentStep) => Math.max(currentStep - 1, 1))
  }

  const goToNextStep = (sideTap?: boolean) => {
    if (step === directionsLength && !sideTap) {
      navigate(`/recipe/${params.id}`)
    }
    setStep((currentStep) => Math.min(currentStep + 1, directionsLength))
  }

  if (!recipe) {
    return <RecipeNotFound />
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

          <div className="relative flex min-w-0 flex-1 items-start justify-center overflow-y-auto p-4 md:items-center md:p-8">
            <Carousel
              className="h-full w-full min-w-0"
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
                      <div className="no-scrollbar flex h-full flex-col overflow-y-auto rounded-4xl bg-accent p-6 md:min-h-100 md:p-12">
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
                                  {formatIngredientAmount(
                                    ingredient.amount * servingMultiplier
                                  )}{" "}
                                  {ingredient.unit} {ingredient.name}
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

            {isMobile && isTapToNavigateEnabled && (
              <div className="absolute inset-0 grid grid-cols-[30%_40%_30%] md:hidden">
                <button
                  type="button"
                  aria-label="Previous step"
                  className="h-full w-full bg-transparent"
                  onClick={() => goToPreviousStep(true)}
                />
                <div aria-hidden="true" />
                <button
                  type="button"
                  aria-label="Next step"
                  className="h-full w-full bg-transparent"
                  onClick={() => goToNextStep(true)}
                />
              </div>
            )}
          </div>

          <div className="hidden justify-center p-6 md:flex md:pb-10">
            <div className="flex w-full items-center justify-between rounded-full bg-accent px-6 py-4">
              <Button
                variant="ghost"
                onClick={() => goToPreviousStep(false)}
                className="max-w-[40%]"
              >
                <ChevronLeft />
                <span className="truncate">{getPreviousButtonText()}</span>
              </Button>
              <Button
                variant="ghost"
                onClick={() => goToNextStep(false)}
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
