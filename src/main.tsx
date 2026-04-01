import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { ThemeProvider } from "@/components/theme-provider.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "./index.css"
import Router from "./router/Router.tsx"
import { NuqsAdapter } from "nuqs/adapters/react-router/v7"
import { TooltipProvider } from "@/components/ui/tooltip"

const queryClient = new QueryClient()

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <NuqsAdapter defaultOptions={{ clearOnDefault: false }}>
            <Router />
          </NuqsAdapter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)
