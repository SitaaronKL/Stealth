"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
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
} from "lucide-react"
import type { Tool } from "@/lib/types"

interface ToolsPanelProps {
  activeTool: Tool
  setActiveTool: (tool: Tool) => void
}

export default function ToolsPanel({ activeTool, setActiveTool }: ToolsPanelProps) {
  const tools = [
    { id: "move" as Tool, icon: Move, label: "Move Tool (V)" },
    { id: "select" as Tool, icon: MousePointer, label: "Selection Tool (S)" },
    { id: "text" as Tool, icon: Type, label: "Text Tool (T)" },
    { id: "brush" as Tool, icon: Pencil, label: "Brush Tool (B)" },
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
    <div className="w-12 border-r border-zinc-800 bg-zinc-950 flex flex-col items-center py-2">
      <TooltipProvider delayDuration={300}>
        {tools.map((tool) => (
          <Tooltip key={tool.id}>
            <TooltipTrigger asChild>
              <Button
                variant={activeTool === tool.id ? "secondary" : "ghost"}
                size="icon"
                className="h-9 w-9 rounded-md mb-1"
                onClick={() => setActiveTool(tool.id)}
              >
                <tool.icon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{tool.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  )
}

