"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  ImageIcon,
  Type,
  Square,
} from "lucide-react"
import type { Layer } from "@/lib/types"

interface LayersPanelProps {
  layers: Layer[]
  activeLayerId: string
  setActiveLayerId: (id: string) => void
  addLayer: () => void
  deleteLayer: (id: string) => void
  toggleVisibility: (id: string) => void
  toggleLock: (id: string) => void
  updateOpacity: (id: string, opacity: number) => void
}

export default function LayersPanel({
  layers,
  activeLayerId,
  setActiveLayerId,
  addLayer,
  deleteLayer,
  toggleVisibility,
  toggleLock,
  updateOpacity,
}: LayersPanelProps) {
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({})
  const [editingOpacity, setEditingOpacity] = useState<string | null>(null)

  const getLayerIcon = (type: string) => {
    switch (type) {
      case "raster":
        return <ImageIcon className="h-4 w-4" />
      case "text":
        return <Type className="h-4 w-4" />
      case "shape":
        return <Square className="h-4 w-4" />
      default:
        return <ImageIcon className="h-4 w-4" />
    }
  }

  const toggleExpanded = (id: string) => {
    setExpandedLayers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-sm font-medium">Layers</h3>
        <Button variant="ghost" size="icon" onClick={addLayer}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {layers.map((layer) => (
          <div key={layer.id} className="mb-1">
            <div
              className={`flex items-center p-2 rounded ${activeLayerId === layer.id ? "bg-zinc-800" : "hover:bg-zinc-800/50"}`}
              onClick={() => setActiveLayerId(layer.id)}
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 mr-1"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpanded(layer.id)
                }}
              >
                {expandedLayers[layer.id] ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
              </Button>

              <div className="mr-1">{getLayerIcon(layer.type)}</div>

              <span className="text-sm flex-1 truncate">{layer.name}</span>

              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleVisibility(layer.id)
                  }}
                >
                  {layer.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleLock(layer.id)
                  }}
                >
                  {layer.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                </Button>

                {layers.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteLayer(layer.id)
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {expandedLayers[layer.id] && (
              <div className="ml-8 mt-2 mb-2">
                <div className="flex items-center mb-2">
                  <span className="text-xs w-16">Opacity:</span>
                  <Slider
                    value={[layer.opacity]}
                    min={0}
                    max={100}
                    step={1}
                    className="w-32"
                    onValueChange={(value) => updateOpacity(layer.id, value[0])}
                  />
                  <span className="text-xs ml-2 w-8">{layer.opacity}%</span>
                </div>

                <div className="text-xs text-zinc-400">
                  Owner: {layer.owner === "current-user" ? "You" : layer.owner}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

