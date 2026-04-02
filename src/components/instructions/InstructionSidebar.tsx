import cookedLogo from "@/assets/cooked.svg"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import type { RecipeModel } from "@/hooks/queries/recipeQueries"
import { List, Settings } from "lucide-react"
import { parseAsInteger, useQueryState } from "nuqs"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import IngredientsDrawer from "./IngredientsDrawer"
import SettingsDrawer from "./SettingsDrawer"
import { Kbd } from "../ui/kbd"

type Props = {
  recipe: RecipeModel
}

export function InstructionSidebar({ recipe }: Props) {
  const [step, setStep] = useQueryState("step", parseAsInteger.withDefault(1))
  const [isIngredientsDrawerOpen, setIsIngredientsDrawerOpen] =
    useState<boolean>(false)
  const [isSettingsDrawerOpen, setIsSettingsDrawerOpen] =
    useState<boolean>(false)
  const navigate = useNavigate()

  const isMobile = window.matchMedia("(max-width: 768px)").matches
  const { toggleSidebar } = useSidebar()

  function handleInstructionClick(index: number) {
    if (isMobile) toggleSidebar()
    setStep(index + 1)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    if (event.key.toLowerCase() === "i") {
      setIsIngredientsDrawerOpen((open) => !open)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <div
            onClick={() => navigate("/")}
            className="flex cursor-pointer flex-row items-center justify-center gap-6 p-6"
          >
            <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
              cooked
            </h1>
            <img src={cookedLogo} alt="Cooked logo" className="h-8 w-auto" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup title="Instructions">
            <SidebarMenu className="gap-2">
              {recipe.directions.map((direction, index) => {
                const isActive = index + 1 === step

                return (
                  <SidebarMenuButton
                    key={`direction-${index}`}
                    isActive={isActive}
                    onClick={() => handleInstructionClick(index)}
                    className="cursor-pointer py-6"
                  >
                    <div
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs text-white ${
                        isActive ? "bg-primary" : "bg-chart-2"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="truncate text-sm">{direction}</span>
                  </SidebarMenuButton>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {isMobile && (
                <SidebarMenuButton
                  className="cursor-pointer gap-2 py-6"
                  onClick={() => setIsSettingsDrawerOpen(true)}
                >
                  <Settings />
                  Settings
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="cursor-pointer gap-2 py-6"
                onClick={() => setIsIngredientsDrawerOpen(true)}
              >
                <div className="flex flex-row items-center gap-2">
                  <List />
                  Ingredient list
                </div>
                {!isMobile && <Kbd className="ml-auto font-mono">I</Kbd>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SettingsDrawer
        open={isSettingsDrawerOpen}
        setOpen={setIsSettingsDrawerOpen}
      />

      <IngredientsDrawer
        recipe={recipe}
        open={isIngredientsDrawerOpen}
        setOpen={setIsIngredientsDrawerOpen}
      />
    </>
  )
}
