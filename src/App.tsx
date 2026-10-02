import { Suspense } from "react"
import { RouterProvider } from "react-router"
import { router } from "./config/routes"
import { Spinner } from "@/components/ui/spinner"

function App() {

  return (
    <Suspense fallback={
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
        <Spinner className="size-6 text-primary" />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
