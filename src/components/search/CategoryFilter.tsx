import { Button } from "@/components/ui/button"
import { getCategoryIcon } from "@/lib/categoryConfig.ts"
import { TooltipTrigger, Tooltip, TooltipContent } from "../ui/tooltip"

interface CategoryFilterProps {
  categories: string[]
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-2"
      style={{ scrollbarWidth: "none" }}
    >
      <Button
        variant={activeCategory === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange?.("all")}
        className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full p-0 text-xl font-bold"
        title="All recipes"
      >
        All
      </Button>
      {categories.map((category) => (
        <Tooltip key={category}>
          <TooltipTrigger
            render={
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => onCategoryChange?.(category)}
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full p-0"
                title={category}
              >
                {getCategoryIcon(category, 44)}
              </Button>
            }
          />
          <TooltipContent>{category}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
