import recipesTemplate from "@/../recipes_template.json"

const EXAMPLE_RAW_RECIPE = {
  recipe_name: "Apple Strudel Muffins",
  prep_time: "20 mins",
  cook_time: "20 mins",
  total_time: "45 mins",
  servings: "12",
  yield: "12 muffins",
  rating: 4.5,
  url: "https://www.allrecipes.com/recipe/33157/apple-strudel-muffins/",
  cuisine_path:
    "/Bread/Quick Bread Recipes/Muffin Recipes/Apple Muffin Recipes/",
  image:
    "https://www.allrecipes.com/thmb/QTc6kTodu38CuuTDlcAz9XbueDA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/1097944-apple-strudel-muffins-Korona-1x1-2-6710dec0aba7474a80c89f21a2059ebc.jpg",
  ingredients: [
    {
      name: "all-purpose flour",
      amount: 2.0,
      unit: "cups",
      template_amount_var: "amountIng1",
      template_unit_var: "unitIng1",
      template_name_var: "nameIng1",
    },
    {
      name: "baking powder",
      amount: 1.0,
      unit: "teaspoon",
      template_amount_var: "amountIng2",
      template_unit_var: "unitIng2",
      template_name_var: "nameIng2",
    },
    {
      name: "baking soda",
      amount: 0.5,
      unit: "teaspoon",
      template_amount_var: "amountIng3",
      template_unit_var: "unitIng3",
      template_name_var: "nameIng3",
    },
    {
      name: "salt",
      amount: 0.5,
      unit: "teaspoon",
      template_amount_var: "amountIng4",
      template_unit_var: "unitIng4",
      template_name_var: "nameIng4",
    },
    {
      name: "white sugar",
      amount: 1.0,
      unit: "cup",
      template_amount_var: "amountIng5",
      template_unit_var: "unitIng5",
      template_name_var: "nameIng5",
    },
    {
      name: "butter",
      amount: 0.5,
      unit: "cup",
      template_amount_var: "amountIng6",
      template_unit_var: "unitIng6",
      template_name_var: "nameIng6",
    },
    {
      name: "eggs",
      amount: 2.0,
      unit: "large",
      template_amount_var: "amountIng7",
      template_unit_var: "unitIng7",
      template_name_var: "nameIng7",
    },
    {
      name: "vanilla",
      amount: 1.25,
      unit: "teaspoons",
      template_amount_var: "amountIng8",
      template_unit_var: "unitIng8",
      template_name_var: "nameIng8",
    },
    {
      name: "chopped apples",
      amount: 1.5,
      unit: "cups",
      template_amount_var: "amountIng9",
      template_unit_var: "unitIng9",
      template_name_var: "nameIng9",
    },
  ],
  directions: [
    "Preheat the oven to 375 degrees F (190 degrees C). Grease a 12-cup muffin pan.",
    "Mix flour, baking powder, baking soda, and salt in a medium bowl.",
    "Beat together sugar, butter, and eggs in a large bowl until smooth. Mix in vanilla. Stir in apples, then gradually blend in flour mixture. Spoon batter into the prepared muffin pan.",
    "Make topping: Mix brown sugar, flour, and cinnamon in a small bowl. Cut in butter until mixture resembles coarse crumbs. Sprinkle over each muffin top.",
    "Bake in the preheated oven until a toothpick inserted in the center of a muffin comes out clean, about 20 minutes. Let sit 5 minutes before transferring muffins to a wire rack to cool.",
    "Korona",
  ],
  nutrition: {
    Total: "Sugars 24g",
    Saturated: "Fat 6g 29%",
    Cholesterol: "54mg 18%",
    Sodium: "255mg 11%",
    Dietary: "Fiber 1g 4%",
    Protein: "3g",
    Vitamin: "C 1mg 4%",
    Calcium: "33mg 3%",
    Iron: "1mg 7%",
    Potassium: "63mg 1%",
  },
  template_vars: {
    amountIng1: 2.0,
    unitIng1: "cups",
    nameIng1: "all-purpose flour",
    amountIng2: 1.0,
    unitIng2: "teaspoon",
    nameIng2: "baking powder",
    amountIng3: 0.5,
    unitIng3: "teaspoon",
    nameIng3: "baking soda",
    amountIng4: 0.5,
    unitIng4: "teaspoon",
    nameIng4: "salt",
    amountIng5: 1.0,
    unitIng5: "cup",
    nameIng5: "white sugar",
    amountIng6: 0.5,
    unitIng6: "cup",
    nameIng6: "butter",
    amountIng7: 2.0,
    unitIng7: "large",
    nameIng7: "eggs",
    amountIng8: 1.25,
    unitIng8: "teaspoons",
    nameIng8: "vanilla",
    amountIng9: 1.5,
    unitIng9: "cups",
    nameIng9: "chopped apples",
  },
}

export type RawRecipeModel = {
  recipe_name: string
  prep_time: string
  cook_time: string
  total_time: string
  servings: string // number of portions
  yield: string
  rating: number // out of 5
  url: string
  cuisine_path: string
  image: string
  ingredients: {
    name: string
    amount: number | null
    unit: string | null
    template_amount_var: string
    template_unit_var: string
    template_name_var: string
  }[]
  directions: string[]
  nutrition: Record<string, string>
  template_vars: Record<string, string | number>
}

export type IngredientModel = {
  name: string
  amount: number
  unit: string
  templateAmountVar: string
  templateUnitVar: string
  templateNameVar: string
}

export type RecipeModel = {
  name: string
  prepTime: string
  cookTime: string
  totalTime: string
  servings: number
  yield: string
  rating: number // out of 5
  url: string
  tags: string[]
  image: string
  ingredients: IngredientModel[]
  directions: string[]
  nutrition: Record<string, string>
  templateVars: Record<string, string | number>
  categories: string[]
}

const parseServings = (servings: string): number => {
  const parsed = Number.parseInt(servings, 10)
  return Number.isFinite(parsed) ? parsed : 0
}

const parseTags = (cuisinePath: string): string[] =>
  cuisinePath
    .split("/")
    .map((tag) => tag.trim())
    .filter(Boolean)

export const inferCategories = (cuisinePath: string, totalMinutes?: number): string[] => {
  const tags = parseTags(cuisinePath);
  const categories = new Set<string>();  
  const allTags = tags.map(t => t.toLowerCase()).join(" ");
  if (/bread|pastry|bake|muffin|scone/.test(allTags)) categories.add("Bread");
  if (/dessert|cookie|cake|candy/.test(allTags)) categories.add("Dessert");
  if (/drink|beverage|cocktail|juice|smoothie/.test(allTags)) categories.add("Beverage");
  if (/soup|stew|chili/.test(allTags)) categories.add("Soup");
  if (/salad/.test(allTags)) categories.add("Salad");
  if (/breakfast|brunch/.test(allTags)) categories.add("Breakfast");
  if (/meat|poultry|seafood|chicken|pork|lamb|main/.test(allTags)) categories.add("Main");
  if (/side|sauce|condiment/.test(allTags)) categories.add("Side");
  if (totalMinutes && totalMinutes <= 30) categories.add("Quick");
  return categories.size > 0 ? [...categories] : ["Other"];
};

const parseRecipe = (rawRecipe: RawRecipeModel): RecipeModel => ({
  name: rawRecipe.recipe_name,
  prepTime: rawRecipe.prep_time,
  cookTime: rawRecipe.cook_time,
  totalTime: rawRecipe.total_time,
  servings: parseServings(rawRecipe.servings),
  yield: rawRecipe.yield,
  rating: rawRecipe.rating,
  url: rawRecipe.url,
  tags: parseTags(rawRecipe.cuisine_path),
  image: rawRecipe.image,
  ingredients: rawRecipe.ingredients.map((ingredient) => ({
    name: ingredient.name,
    amount: ingredient.amount ?? 0,
    unit: ingredient.unit ?? "",
    templateAmountVar: ingredient.template_amount_var,
    templateUnitVar: ingredient.template_unit_var,
    templateNameVar: ingredient.template_name_var,
  })),
  directions: rawRecipe.directions,
  nutrition: rawRecipe.nutrition,
  templateVars: rawRecipe.template_vars,
  categories: inferCategories(rawRecipe.cuisine_path, parseInt(rawRecipe.cook_time)),
})

// index corresponds to the recipe's position in the original JSON file, which is also used in the URL for recipe details
export const getRecipe = (index: string | undefined): RecipeModel | null => {
  if (index === undefined) {
    return null
  }

  const indexAsNumber = Number.parseInt(index)

  if (!Number.isFinite(indexAsNumber)) {
    return null
  }

  const recipe = getRecipeList()[indexAsNumber]

  return recipe || null
}

const cachedRecipes: RecipeModel[] | null = null;

export const getRecipeList = (): RecipeModel[] => {
  if (cachedRecipes) return cachedRecipes;
  const rawRecipes = recipesTemplate as unknown as RawRecipeModel[]
  return rawRecipes.map(parseRecipe)
}
