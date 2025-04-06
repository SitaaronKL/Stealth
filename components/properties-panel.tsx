"use client"

import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Layer } from "@/lib/types"

interface PropertiesPanelProps {
  layer: Layer | undefined
  updateOpacity: (id: string, opacity: number) => void
}

export default function PropertiesPanel({ layer, updateOpacity }: PropertiesPanelProps) {
  if (!layer) {
    return <div className="p-4 text-sm text-zinc-500">No layer selected</div>
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <Label htmlFor="layer-name" className="text-xs">
          Name
        </Label>
        <Input
          id="layer-name"
          value={layer.name}
          className="h-8 mt-1"
          // In a real app, we would handle name changes
        />
      </div>

      <div>
        <Label htmlFor="layer-opacity" className="text-xs">
          Opacity
        </Label>
        <div className="flex items-center mt-1">
          <Slider
            id="layer-opacity"
            value={[layer.opacity]}
            min={0}
            max={100}
            step={1}
            className="flex-1"
            onValueChange={(value) => updateOpacity(layer.id, value[0])}
          />
          <span className="text-xs ml-2 w-8">{layer.opacity}%</span>
        </div>
      </div>

      {layer.type === "text" && (
        <>
          <div>
            <Label htmlFor="text-content" className="text-xs">
              Text Content
            </Label>
            <Input
              id="text-content"
              value="Sample Text"
              className="h-8 mt-1"
              // In a real app, we would handle text changes
            />
          </div>

          <div>
            <Label htmlFor="font-family" className="text-xs">
              Font Family
            </Label>
            <Input
              id="font-family"
              value="Arial"
              className="h-8 mt-1"
              // In a real app, we would handle font changes
            />
          </div>

          <div>
            <Label htmlFor="font-size" className="text-xs">
              Font Size
            </Label>
            <Input
              id="font-size"
              type="number"
              value="24"
              className="h-8 mt-1"
              // In a real app, we would handle font size changes
            />
          </div>
        </>
      )}

      {layer.type === "shape" && (
        <>
          <div>
            <Label htmlFor="shape-width" className="text-xs">
              Width
            </Label>
            <Input
              id="shape-width"
              type="number"
              value="200"
              className="h-8 mt-1"
              // In a real app, we would handle width changes
            />
          </div>

          <div>
            <Label htmlFor="shape-height" className="text-xs">
              Height
            </Label>
            <Input
              id="shape-height"
              type="number"
              value="200"
              className="h-8 mt-1"
              // In a real app, we would handle height changes
            />
          </div>
        </>
      )}

      <div className="pt-2 border-t border-zinc-800">
        <Label className="text-xs">Position</Label>
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div>
            <Label htmlFor="pos-x" className="text-xs">
              X
            </Label>
            <Input
              id="pos-x"
              type="number"
              value="100"
              className="h-8 mt-1"
              // In a real app, we would handle position changes
            />
          </div>
          <div>
            <Label htmlFor="pos-y" className="text-xs">
              Y
            </Label>
            <Input
              id="pos-y"
              type="number"
              value="100"
              className="h-8 mt-1"
              // In a real app, we would handle position changes
            />
          </div>
        </div>
      </div>
    </div>
  )
}

