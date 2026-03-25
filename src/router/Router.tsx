import App from "@/App"
import { BrowserRouter, Route, Routes } from "react-router"

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
    </BrowserRouter>
  )
}
