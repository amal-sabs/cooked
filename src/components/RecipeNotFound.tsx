import { useNavigate } from "react-router"
import { Button } from "./ui/button"

export default function RecipeNotFound() {
  const navigate = useNavigate()

  return (
    <div className="flex h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="mb-2 text-2xl font-bold">Recipe Not Found</h2>
      <p className="mb-6 text-gray-500">you cooked a little too hard...</p>
      <Button onClick={() => navigate("/")}>Back to home</Button>
    </div>
  )
}
