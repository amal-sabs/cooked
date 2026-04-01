import cookedLogo from "@/../public/cooked.svg"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import type { RecipeModel } from "@/hooks/queries/recipeQueries"

type Props = {
  recipe: RecipeModel
  currentStep: number
}

//todo make it actually look nice trust the process ong - steven
export function InstructionSidebar({ recipe, currentStep }: Props) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-6">
          <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
            cooked{" "}
            <img src={cookedLogo} alt="Cooked logo" className="h-8 w-auto" />
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup title="Instructions">
          <SidebarMenu>
            {recipe.directions.map((direction, index) => {
              const isActive = index + 1 === currentStep

              return (
                <SidebarMenuButton key={`direction-${index}`}>
                  <div
                    key={`${recipe.name}-${index}`}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg p-3 ${
                      isActive
                        ? "bg-gray-200"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-xs text-white ${
                        isActive ? "bg-gray-700" : "bg-gray-400"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="truncate text-sm font-medium">
                      {direction}
                    </span>
                  </div>
                </SidebarMenuButton>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
