import { redirect } from "next/navigation"
import EditorWorkspace from "@/components/editor-workspace"

export default function Home() {
  // In a real app, we would check authentication here
  // and redirect to login if not authenticated
  const isAuthenticated = true

  if (!isAuthenticated) {
    redirect("/login")
  }

  return <EditorWorkspace />
}

