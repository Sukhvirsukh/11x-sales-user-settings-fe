import { Suspense } from "react"
import { RouterProvider } from "react-router"
import { router } from "./config/routes"

function App() {

  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center" />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
