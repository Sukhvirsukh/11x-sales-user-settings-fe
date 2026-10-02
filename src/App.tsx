import { Suspense } from "react"
import { RouterProvider } from "react-router"
import { router } from "./config/routes"
import LoadingScreen from "@/components/design/LoadingScreen"

function App() {

  return (
    <Suspense fallback={
      <div className="flex min-h-dvh flex-col items-center justify-center gap-3 bg-background">
        <LoadingScreen />
        <p className="text-sm text-muted-foreground">Loading your workspace…</p>
      </div>
    }>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
