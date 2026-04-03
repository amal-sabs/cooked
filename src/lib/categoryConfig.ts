import { 
  Croissant, Cake, UtensilsCrossed,
  Egg, Salad, Soup, Bookmark, 
  type LucideProps,
  ChefHat,
  GlassWater,
  Utensils,
  Tag,
  Timer
} from 'lucide-react';
import { createElement, type ReactNode} from 'react';

export const RECIPE_CATEGORIES = {
  Bread: 'Bread',
  Dessert: 'Dessert',
  Main: 'Main',
  Appetizer: 'Appetizer',
  Beverage: 'Beverage',
  Breakfast: 'Breakfast',
  Salad: 'Salad',
  Side: 'Side',
  Soup: 'Soup',
  Other: 'Other',
  Quick: 'Quick',
} as const;

export const CATEGORY_ORDER: RecipeCategory[] = [
  'Quick',
  'Breakfast',
  'Main',
  'Soup',
  'Salad',
  'Side',
  'Appetizer',
  'Bread',
  'Dessert',
  'Beverage',
  'Other',
];

export type RecipeCategory = (typeof RECIPE_CATEGORIES)[keyof typeof RECIPE_CATEGORIES];

const CATEGORY_ICONS: Record<RecipeCategory, React.FC<LucideProps>> = {
  Bread: Croissant,
  Dessert: Cake,
  Main: UtensilsCrossed,
  Appetizer: ChefHat,       
  Beverage: GlassWater,     
  Breakfast: Egg,
  Salad: Salad,
  Side: Utensils,           
  Soup: Soup,
  Other: Tag,
  Quick: Timer,
};

export function getCategoryIcon(
  category: string, 
  size: number = 24 
): ReactNode {
  const Icon = CATEGORY_ICONS[category as RecipeCategory] || Bookmark;   
  return createElement(Icon, { 
  size: size,
  strokeWidth: 2,
  className: "shrink-0",
  style: { width: size, height: size }  
});
}