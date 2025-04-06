export type Tool =
  | "move"
  | "select"
  | "text"
  | "brush"
  | "rectangle"
  | "ellipse"
  | "image"
  | "eraser"
  | "crop"
  | "eyedropper"
  | "hand"
  | "zoom"
  | "comment"

export type Layer = {
  id: string
  name: string
  visible: boolean
  locked: boolean
  opacity: number
  type: "raster" | "text" | "shape"
  owner: string
  data: any
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

