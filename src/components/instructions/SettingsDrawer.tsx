import {
  Drawer,
  DrawerHeader,
  DrawerFooter,
  DrawerContent,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"
import { MousePointerClick, MoveHorizontal } from "lucide-react"
import { useState } from "react"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SettingsDrawer({ open, setOpen }: Props) {
  const handleDrawerClose = () => {}

  const localStorageKey = "cooked-instruction-view-settings"
  const defaultSettings = {
    navigationStyle: "swipe",
  }

  const isMobile = window.matchMedia("(max-width: 768px)").matches
  const direction = isMobile ? "bottom" : "right"
  const [navigationStyle, setNavigationStyle] = useState<"tap" | "swipe">(
    () => {
      const savedSettings = localStorage.getItem(localStorageKey)
      if (savedSettings) {
        const { navigationStyle } = JSON.parse(savedSettings)
        return navigationStyle
      }
      return defaultSettings.navigationStyle
    }
  )

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={direction}
      onClose={handleDrawerClose}
    >
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle className="py-2 text-2xl">Settings</DrawerTitle>
          <DrawerDescription>
            Adjust settings to your preference
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 p-4">
          <div className="flex flex-row content-start items-start justify-between rounded-lg border-2 p-4">
            <div className="flex flex-col">
              <span className="text-lg">
                (Mobile only) Step navigation style
              </span>
              <span className="w-max-80 text-sm text-muted-foreground">
                Whether you prefer tapping or swiping to navigate between steps.
              </span>
            </div>
            <ToggleGroup
              variant="outline"
              value={[navigationStyle]}
              onValueChange={(value) => {
                if (value && value.length > 0) {
                  setNavigationStyle(value[0] as "tap" | "swipe")
                  localStorage.setItem(
                    localStorageKey,
                    JSON.stringify({ navigationStyle: value[0] })
                  )
                }
              }}
            >
              <ToggleGroupItem value="tap">
                <MousePointerClick />
                Tap
              </ToggleGroupItem>
              <ToggleGroupItem value="swipe">
                <MoveHorizontal />
                Swipe
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
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
