"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import type { Layer, Tool, User, Comment } from "@/lib/types"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface EditorCanvasProps {
  document: {
    id: string
    name: string
    width: number
    height: number
  }
  layers: Layer[]
  activeLayerId: string
  activeTool: Tool
  collaborators: User[]
  comments: Comment[]
  addComment: (x: number, y: number, text: string) => void
}

export default function EditorCanvas({
  document,
  layers,
  activeLayerId,
  activeTool,
  collaborators,
  comments,
  addComment,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newComment, setNewComment] = useState<{ x: number; y: number; text: string } | null>(null)

  // Handle canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw checkerboard pattern for transparency
    const squareSize = 10
    for (let x = 0; x < canvas.width; x += squareSize) {
      for (let y = 0; y < canvas.height; y += squareSize) {
        if ((x / squareSize + y / squareSize) % 2 === 0) {
          ctx.fillStyle = "#f0f0f0"
        } else {
          ctx.fillStyle = "#e0e0e0"
        }
        ctx.fillRect(x, y, squareSize, squareSize)
      }
    }

    // In a real app, we would render the actual layer content here
    // For now, we'll just draw placeholder content
    layers.forEach((layer) => {
      if (!layer.visible) return

      ctx.globalAlpha = layer.opacity / 100

      // Draw placeholder content based on layer type
      if (layer.type === "raster") {
        ctx.fillStyle = layer.id === activeLayerId ? "#3b82f6" : "#6b7280"
        ctx.fillRect(50, 50, 200, 200)
      } else if (layer.type === "text") {
        ctx.fillStyle = layer.id === activeLayerId ? "#3b82f6" : "#6b7280"
        ctx.font = "24px sans-serif"
        ctx.fillText("Text Layer", 50, 300)
      } else if (layer.type === "shape") {
        ctx.fillStyle = layer.id === activeLayerId ? "#3b82f6" : "#6b7280"
        ctx.beginPath()
        ctx.arc(400, 200, 100, 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
    })
  }, [layers, activeLayerId, document])

  // Handle canvas interactions
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !containerRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / scale
    const y = (e.clientY - rect.top) / scale

    if (activeTool === "hand") {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    } else if (activeTool === "comment") {
      setNewComment({ x, y, text: "" })
    }
    // Other tool interactions would be handled here
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
    // Other tool interactions would be handled here
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    // Other tool interactions would be handled here
  }

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 5))
  }

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.1))
  }

  const handleZoomReset = () => {
    setScale(1)
    setPosition({ x: 0, y: 0 })
  }

  const handleCommentSubmit = () => {
    if (newComment && newComment.text.trim()) {
      addComment(newComment.x, newComment.y, newComment.text)
      setNewComment(null)
    }
  }

  return (
    <div className="relative flex-1 overflow-hidden bg-zinc-800" ref={containerRef}>
      {/* Canvas container */}
      <div
        className="absolute"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
        }}
      >
        <canvas
          ref={canvasRef}
          width={document.width}
          height={document.height}
          className="border border-zinc-700 shadow-lg"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />

        {/* Collaborator cursors */}
        {collaborators.map((user) => (
          <div
            key={user.id}
            className="absolute pointer-events-none"
            style={{
              left: user.cursor.x,
              top: user.cursor.y,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div className="relative">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 4L12 20L14 14L20 12L4 4Z" fill={user.color} stroke="white" strokeWidth="1.5" />
              </svg>
              <div
                className="absolute top-6 left-6 px-2 py-1 rounded text-xs whitespace-nowrap"
                style={{ backgroundColor: user.color }}
              >
                {user.name}
              </div>
            </div>
          </div>
        ))}

        {/* Comments */}
        {comments
          .filter((c) => !c.resolved)
          .map((comment) => (
            <div
              key={comment.id}
              className="absolute"
              style={{
                left: comment.x,
                top: comment.y,
              }}
            >
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                <MessageSquare className="w-3 h-3 text-zinc-900" />
              </div>
            </div>
          ))}

        {/* New comment input */}
        {newComment && (
          <div
            className="absolute"
            style={{
              left: newComment.x,
              top: newComment.y,
            }}
          >
            <div className="bg-zinc-900 border border-zinc-700 rounded-md p-2 shadow-lg -translate-x-1/2 -translate-y-1/2 w-64">
              <div className="flex mb-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment.text}
                  onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                  autoFocus
                  className="text-sm"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setNewComment(null)} className="text-xs h-7">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleCommentSubmit} className="text-xs h-7">
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-zinc-900 rounded-md p-1 shadow-lg">
        <Button variant="ghost" size="icon" onClick={handleZoomOut} className="h-7 w-7">
          <span className="text-lg">−</span>
        </Button>
        <Button variant="ghost" onClick={handleZoomReset} className="h-7 px-2 text-xs">
          {Math.round(scale * 100)}%
        </Button>
        <Button variant="ghost" size="icon" onClick={handleZoomIn} className="h-7 w-7">
          <span className="text-lg">+</span>
        </Button>
      </div>
    </div>
  )
}

