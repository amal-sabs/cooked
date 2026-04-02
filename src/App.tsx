import { Button } from "@/components/ui/button"
import cookedLogo from "@/assets/cooked.svg"
import { Kbd } from "./components/ui/kbd"
import { useNavigate } from "react-router"
import { useEffect } from "react"

export function App() {
  const navigate = useNavigate()

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.repeat) {
      return
    }

    if (event.metaKey || event.ctrlKey || event.altKey) {
      return
    }

    switch (event.key.toLowerCase()) {
      case "s":
        navigate("/search")
        break
      case "i":
        navigate("/recipe/0/instructions")
        break
      case "r":
        navigate("/recipe/0")
        break
      default:
        return
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  })

  return (
    <div className="mt-8 flex min-h-svh w-full justify-center p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <div>
          <div className="flex cursor-pointer flex-row items-center justify-center gap-6 p-6">
            <h1 className="flex items-center gap-2 text-3xl font-bold text-primary">
              cooked
            </h1>
            <img src={cookedLogo} alt="Cooked logo" className="h-8 w-auto" />
          </div>
          <h1 className="font-medium"></h1>
          <p>
            This is the index page for the project. We'll remove this once all
            of the planned views are implemented.
          </p>
          <span className="text-sm text-muted-foreground italic">
            see Router.tsx for routing TODO
          </span>
          <p>Use the following to navigate to the three views:</p>
          <div className="flex w-full flex-row gap-4">
            <Button
              variant="outline"
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/search")}
            >
              Search <Kbd>S</Kbd>
            </Button>
            <Button
              variant="outline"
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/recipe/0")}
            >
              Recipe <Kbd>R</Kbd>
            </Button>
            <Button
              variant="outline"
              className="mt-2 cursor-pointer"
              onClick={() => navigate("/recipe/0/instructions")}
            >
              Instruction <Kbd color="primary">I</Kbd>
            </Button>
          </div>
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <Kbd>D</Kbd> to toggle dark mode)
        </div>
      </div>
    </div>
  )
}

export default App
