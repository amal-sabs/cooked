import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import type { RecipeModel } from "@/hooks/queries/recipeQueries"
import { formatIngredientAmount } from "@/utils/ingredientUtils"
import type { InstructionViewParams } from "@/views/InstructionView"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { parseAsInteger, useQueryState } from "nuqs"
import { Input } from "../ui/input"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  recipe: RecipeModel
}

/**
 * Writes the checked state of the ingredient list into localStorage for a given recipe.
 * @param recipeId the recipe id, equivalent to the id in the url, or its recipes_template.json index + 1.
 * @param checkedState the checked state of all ingredients, where the key is the ingredient name and the value is whether it's checked or not.
 */
function persistCheckedStateToLocalStorage(
  recipeId: string,
  checkedState: Record<string, boolean>
) {
  localStorage.setItem(
    `recipe-${recipeId}-ingredient-list`,
    JSON.stringify(checkedState)
  )
}

export default function IngredientsDrawer({ open, setOpen, recipe }: Props) {
  const params = useParams<InstructionViewParams>()

  const [checkedState, setCheckedState] = useState<Record<string, boolean>>({})
  const [servingCount, setServingCount] = useQueryState(
    "servings",
    parseAsInteger.withDefault(recipe.servings)
  )

  const servingMultiplier = servingCount / recipe.servings

  const handleCheckboxChange = (ingredientName: string) => {
    const newCheckedState = {
      ...checkedState,
      [ingredientName]: !checkedState[ingredientName],
    }
    setCheckedState(newCheckedState)
  }

  const recipeId = params.id
  if (!recipe || !recipeId) {
    return null
  }

  const initializeCheckedStateFromLocalStorage = () => {
    const recipeId = params.id
    if (recipeId === undefined) {
      return
    }
    const storedState = localStorage.getItem(
      `recipe-${recipeId}-ingredient-list`
    )
    if (storedState) {
      setCheckedState(JSON.parse(storedState))
    } else {
      // initialize with all ingredients unchecked
      const initialState: Record<string, boolean> = {}
      recipe.ingredients.forEach((ingredient) => {
        initialState[ingredient.name] = false
      })
      setCheckedState(initialState)
    }
  }

  useEffect(() => {
    initializeCheckedStateFromLocalStorage()
  }, [])

  const handleDrawerClose = () => {
    persistCheckedStateToLocalStorage(recipeId, checkedState)
  }
  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction="right"
      onClose={handleDrawerClose}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="py-2 text-2xl">Ingredients</DrawerTitle>
          <DrawerDescription>
            Check off ingredients as you gather them for the recipe.
          </DrawerDescription>
        </DrawerHeader>
        <div className="justify-content flex flex-col px-4">
          <div className="flex flex-row items-center">
            <span className="px-4 text-sm">For</span>
            <Input
              style={{ width: "60px" }}
              type="number"
              min="1"
              value={servingCount}
              onChange={(e) => {
                if (e.target.value === "") {
                  return
                }
                setServingCount(parseInt(e.target.value) || 1)
              }}
            />
            <span className="px-4 text-sm">servings</span>
          </div>
          {servingCount !== recipe.servings && (
            <span className="px-4 text-sm text-muted-foreground">
              Original recipe serves {recipe.servings} servings.
            </span>
          )}
        </div>

        <div className="flex flex-col gap-4 p-8">
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-medium">
                <Checkbox
                  onCheckedChange={() => {
                    handleCheckboxChange(ingredient.name)
                    persistCheckedStateToLocalStorage(recipeId, {
                      ...checkedState,
                      [ingredient.name]: !checkedState[ingredient.name],
                    })
                  }}
                  checked={checkedState[ingredient.name] || false}
                />
                {ingredient.name}
              </span>
              <span className="text-muted-foreground">
                {formatIngredientAmount(ingredient.amount * servingMultiplier)}{" "}
                {ingredient.unit}
              </span>
            </div>
          ))}
        </div>
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
