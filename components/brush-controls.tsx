import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface BrushControlsProps {
  color: string
  size: number
  onColorChange: (color: string) => void
  onSizeChange: (size: number) => void
}

export default function BrushControls({
  color,
  size,
  onColorChange,
  onSizeChange,
}: BrushControlsProps) {
  return (
    <div className="flex flex-col gap-3 p-2">
      <div className="space-y-1.5">
        <Label className="text-xs">Color</Label>
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-8 h-6 p-0.5"
          />
          <Input
            type="text"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className="flex-1 h-6 text-xs"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between">
          <Label className="text-xs">Size</Label>
          <span className="text-xs text-zinc-400">{size}px</span>
        </div>
        <Slider
          value={[size]}
          min={1}
          max={100}
          step={1}
          onValueChange={(value) => onSizeChange(value[0])}
          className="py-0"
        />
      </div>

      <div className="border rounded p-2 bg-zinc-800">
        <div className="w-full h-12 flex items-center justify-center">
          <div
            className="rounded-full"
            style={{
              backgroundColor: color,
              width: size,
              height: size,
            }}
          />
        </div>
      </div>
    </div>
  )
} 