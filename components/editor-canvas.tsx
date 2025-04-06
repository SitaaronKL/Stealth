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
  updateLayerData: (id: string, data: string) => void
  brushColor: string
  brushSize: number
  eraserSize: number
  fontSize: number
  fontFamily: string
  textColor: string
  activeText: {
    id: string;
    content: string;
    x: number;
    y: number;
  } | null
  onTextChange: (text: string) => void
  onTextAdd: (text: { id: string; content: string; x: number; y: number }) => void
  onImagePaste: (imageData: string) => void
}

export default function EditorCanvas({
  document,
  layers,
  activeLayerId,
  activeTool,
  collaborators,
  comments,
  addComment,
  updateLayerData,
  brushColor,
  brushSize,
  eraserSize,
  fontSize,
  fontFamily,
  textColor,
  activeText,
  onTextChange,
  onTextAdd,
  onImagePaste,
}: EditorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [newComment, setNewComment] = useState<{ x: number; y: number; text: string } | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null)
  const [textInput, setTextInput] = useState<{
    x: number;
    y: number;
    value: string;
  } | null>(null)
  const [editingText, setEditingText] = useState<{
    id: string;
    content: string;
    x: number;
    y: number;
  } | null>(null)

  // Initialize canvas only once with document dimensions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = document.width
    canvas.height = document.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set initial styles
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [document.width, document.height]) // Remove brushColor and brushSize from dependencies

  // Handle canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

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

    // Draw all layers in order
    layers.forEach(layer => {
      if (!layer.visible) return

      ctx.globalAlpha = layer.opacity / 100

      if (layer.type === "text" && layer.textData) {
        console.log("Drawing text:", layer.textData) // Debug log
        ctx.font = `${layer.textData.fontSize}px ${layer.textData.fontFamily}`
        ctx.fillStyle = layer.textData.color
        ctx.textBaseline = 'top' // This helps with text positioning
        ctx.fillText(layer.textData.content, layer.textData.x, layer.textData.y)
      } else if (layer.data) {
        const img = new Image()
        img.src = layer.data
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
      }

      ctx.globalAlpha = 1
    })
  }, [layers, document.width, document.height])

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
    } else if (activeTool === "brush" || activeTool === "eraser") {
      startDrawing(e)
    } else if (activeTool === "text") {
      // Check if clicking on existing text
      const textLayer = layers.find(layer => 
        layer.type === "text" && 
        layer.textData &&
        Math.abs(layer.textData.x - x) < 50 && // Adjust hit area as needed
        Math.abs(layer.textData.y - y) < 50
      )

      if (textLayer?.textData) {
        setEditingText(textLayer.textData)
      } else {
        setEditingText({
          id: `text-${Date.now()}`,
          content: "",
          x,
          y
        })
      }
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    } else if (isDrawing) {
      draw(e)
    }
    // Other tool interactions would be handled here
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    stopDrawing()
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

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const activeLayer = layers.find(layer => layer.id === activeLayerId)
    if (!activeLayer || activeLayer.locked) return

    setIsDrawing(true)
    const point = getMousePos(e)
    setLastPoint(point)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const currentPoint = getMousePos(e)

    if (activeTool === "eraser") {
      // Set up eraser
      ctx.save()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = '#000000'
      ctx.lineWidth = eraserSize
    } else {
      // Normal brush
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = brushColor
      ctx.lineWidth = brushSize
    }

    ctx.beginPath()
    ctx.moveTo(lastPoint.x, lastPoint.y)
    ctx.lineTo(currentPoint.x, currentPoint.y)
    ctx.stroke()

    if (activeTool === "eraser") {
      ctx.restore()
    }

    setLastPoint(currentPoint)
  }

  const stopDrawing = () => {
    if (!isDrawing) return

    setIsDrawing(false)
    setLastPoint(null)

    const canvas = canvasRef.current
    if (!canvas) return

    const activeLayer = layers.find(layer => layer.id === activeLayerId)
    if (!activeLayer) return

    const layerData = canvas.toDataURL()
    updateLayerData(activeLayerId, layerData)
  }

  // Add text input handling
  const handleTextSubmit = () => {
    if (!editingText) return
    onTextAdd(editingText)
    setEditingText(null)
  }

  // Add function to handle text click for editing
  const handleTextClick = (text: { id: string; content: string; x: number; y: number }) => {
    if (activeTool !== "text") return
    setEditingText(text)
  }

  // Update clipboard paste handler
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return

      for (const item of items) {
        if (item.type.indexOf('image') === 0) {
          e.preventDefault()
          
          const file = item.getAsFile()
          if (!file) continue

          const reader = new FileReader()
          reader.onload = (event) => {
            const imageData = event.target?.result as string
            onImagePaste(imageData)
          }

          reader.readAsDataURL(file)
        }
      }
    }

    // Add paste event listener to window
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [onImagePaste])

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

        {/* Text Input */}
        {editingText && (
          <div
            className="absolute"
            style={{
              left: editingText.x + 'px',
              top: editingText.y + 'px',
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          >
            <Input
              type="text"
              value={editingText.content}
              placeholder="Type here..."
              onChange={(e) => setEditingText({ ...editingText, content: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleTextSubmit()
                }
                if (e.key === 'Escape') {
                  setEditingText(null)
                }
              }}
              onBlur={handleTextSubmit}
              autoFocus
              className="bg-transparent border-none text-white shadow-none p-0 min-w-[100px]"
              style={{
                fontFamily,
                fontSize: `${fontSize}px`,
                color: textColor,
              }}
            />
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

