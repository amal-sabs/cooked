import App from "@/App"
import InstructionView from "@/views/InstructionView"
import RecipeView from "@/views/RecipeView"
import SearchView from "@/views/SearchView"
import { BrowserRouter, Route, Routes } from "react-router"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/*TODO reroute to search once all views are implemented */}
        <Route path="/recipe/:id/instructions" element={<InstructionView />} />
        <Route path="/recipe/:id" element={<RecipeView />} />
        <Route path="/search" element={<SearchView />} />
      </Routes>
    </BrowserRouter>
  )
}
