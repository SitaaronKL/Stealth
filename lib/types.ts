export type Tool = "move" | "brush" | "eraser" | "text" | "shape"

export interface Layer {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  type: "raster" | "vector" | "text"
  owner: string
  data: string | null // Base64 encoded image data
  textData?: {
    id: string
    content: string
    x: number
    y: number
    fontFamily: string
    fontSize: number
    color: string
  }
}

export type User = {
  id: string
  name: string
  avatar: string
  role: string
  color: string
  cursor: {
    x: number
    y: number
  }
}

export type Comment = {
  id: string
  x: number
  y: number
  text: string
  author: string
  timestamp: string
  resolved: boolean
}

