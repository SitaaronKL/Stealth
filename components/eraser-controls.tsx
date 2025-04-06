import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EraserControlsProps {
  size: number
  onSizeChange: (size: number) => void
}

export default function EraserControls({
  size,
  onSizeChange,
}: EraserControlsProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-zinc-800 p-2">
        <h4 className="font-medium text-sm">Eraser Settings</h4>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
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
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Mode</Label>
          <Tabs defaultValue="normal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="normal">Normal</TabsTrigger>
              <TabsTrigger value="block">Block</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="border rounded p-3 bg-zinc-800/50">
          <div className="w-full h-16 flex items-center justify-center bg-zinc-950/20 rounded">
            <div
              className="rounded-full border-2 border-white/80"
              style={{
                width: size,
                height: size,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 