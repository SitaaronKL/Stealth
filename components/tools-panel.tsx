"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu"
import {
  Move,
  MousePointer,
  Type,
  Pencil,
  Square,
  Circle,
  Image,
  Eraser,
  Scissors,
  Pipette,
  Hand,
  ZoomIn,
  MessageSquare,
  Brush,
} from "lucide-react"
import type { Tool } from "@/lib/types"
import BrushControls from "./brush-controls"
import EraserControls from "./eraser-controls"

interface ToolsPanelProps {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
  brushColor: string
  brushSize: number
  onBrushColorChange: (color: string) => void
  onBrushSizeChange: (size: number) => void
  eraserSize: number
  onEraserSizeChange: (size: number) => void
}

export default function ToolsPanel({
  activeTool,
  setActiveTool,
  brushColor,
  brushSize,
  onBrushColorChange,
  onBrushSizeChange,
  eraserSize,
  onEraserSizeChange,
}: ToolsPanelProps) {
  const tools = [
    { id: "move" as Tool, icon: Move, label: "Move Tool (V)" },
    { id: "select" as Tool, icon: MousePointer, label: "Selection Tool (S)" },
    { id: "text" as Tool, icon: Type, label: "Text Tool (T)" },
    { id: "brush" as Tool, icon: Brush, label: "Brush Tool (B)" },
    { id: "rectangle" as Tool, icon: Square, label: "Rectangle Tool (R)" },
    { id: "ellipse" as Tool, icon: Circle, label: "Ellipse Tool (E)" },
    { id: "image" as Tool, icon: Image, label: "Place Image (P)" },
    { id: "eraser" as Tool, icon: Eraser, label: "Eraser Tool (Shift+E)" },
    { id: "crop" as Tool, icon: Scissors, label: "Crop Tool (C)" },
    { id: "eyedropper" as Tool, icon: Pipette, label: "Eyedropper Tool (I)" },
    { id: "hand" as Tool, icon: Hand, label: "Hand Tool (H)" },
    { id: "zoom" as Tool, icon: ZoomIn, label: "Zoom Tool (Z)" },
    { id: "comment" as Tool, icon: MessageSquare, label: "Comment Tool (N)" },
  ]

  return (
    <div className="w-16 border-r border-zinc-800 p-2 flex flex-col gap-1">
      {tools.map((tool) => (
        tool.id === "brush" ? (
          <ContextMenu key={tool.id}>
            <ContextMenuTrigger>
              <Button
                size="icon"
                variant={activeTool === tool.id ? "secondary" : "ghost"}
                className="w-12 h-12"
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="w-6 h-6" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <BrushControls
                color={brushColor}
                size={brushSize}
                onColorChange={onBrushColorChange}
                onSizeChange={onBrushSizeChange}
              />
            </ContextMenuContent>
          </ContextMenu>
        ) : tool.id === "eraser" ? (
          <ContextMenu key={tool.id}>
            <ContextMenuTrigger>
              <Button
                size="icon"
                variant={activeTool === tool.id ? "secondary" : "ghost"}
                className="w-12 h-12"
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="w-6 h-6" />
              </Button>
            </ContextMenuTrigger>
            <ContextMenuContent className="w-64">
              <EraserControls
                size={eraserSize}
                onSizeChange={onEraserSizeChange}
              />
            </ContextMenuContent>
          </ContextMenu>
        ) : (
          <Button
            key={tool.id}
            size="icon"
            variant={activeTool === tool.id ? "secondary" : "ghost"}
            className="w-12 h-12"
            onClick={() => setActiveTool(tool.id)}
          >
            <tool.icon className="w-6 h-6" />
          </Button>
        )
      ))}
    </div>
  )
}

