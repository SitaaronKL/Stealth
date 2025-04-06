import type { Layer, User, Comment } from "./types"

export function generateMockLayers(): Layer[] {
  return [
    {
      id: "layer-1",
      name: "Background",
      visible: true,
      locked: false,
      opacity: 100,
      type: "raster",
      owner: "current-user",
      data: null,
    },
    {
      id: "layer-2",
      name: "Text Layer",
      visible: true,
      locked: false,
      opacity: 100,
      type: "text",
      owner: "John Doe",
      data: null,
    },
    {
      id: "layer-3",
      name: "Circle Shape",
      visible: true,
      locked: false,
      opacity: 80,
      type: "shape",
      owner: "current-user",
      data: null,
    },
  ]
}

export function generateMockUsers(): User[] {
  return [
    {
      id: "user-1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Designer",
      color: "#3b82f6",
      cursor: { x: 200, y: 150 },
    },
    {
      id: "user-2",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Art Director",
      color: "#10b981",
      cursor: { x: 400, y: 300 },
    },
    {
      id: "user-3",
      name: "Alex Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      role: "Developer",
      color: "#f59e0b",
      cursor: { x: 600, y: 200 },
    },
  ]
}

export function generateMockComments(): Comment[] {
  return [
    {
      id: "comment-1",
      x: 150,
      y: 200,
      text: "Can we make this section brighter?",
      author: "Jane Smith",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      resolved: false,
    },
    {
      id: "comment-2",
      x: 400,
      y: 300,
      text: "The text needs to be larger here for accessibility",
      author: "current-user",
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      resolved: false,
    },
    {
      id: "comment-3",
      x: 600,
      y: 150,
      text: "This shape should be aligned with the grid",
      author: "Alex Johnson",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      resolved: true,
    },
  ]
}

