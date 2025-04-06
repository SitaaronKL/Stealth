import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

interface EraserControlsProps {
  size: number
  onSizeChange: (size: number) => void
}

export default function EraserControls({
  size,
  onSizeChange,
}: EraserControlsProps) {
  return (
    <div className="flex flex-col gap-3 p-2">
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
            className="rounded-full border-2 border-white"
            style={{
              width: size,
              height: size,
            }}
          />
        </div>
      </div>
    </div>
  )
} 