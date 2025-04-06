import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface TextControlsProps {
  fontSize: number
  onFontSizeChange: (size: number) => void
  fontFamily: string
  onFontFamilyChange: (font: string) => void
  color: string
  onColorChange: (color: string) => void
}

const fontFamilies = [
  "Arial",
  "Times New Roman",
  "Helvetica",
  "Georgia",
  "Courier New",
  "Verdana",
  "Inter",
  "Roboto",
  "Open Sans"
]

export default function TextControls({
  fontSize,
  onFontSizeChange,
  fontFamily,
  onFontFamilyChange,
  color,
  onColorChange,
}: TextControlsProps) {
  return (
    <div className="flex flex-col">
      <div className="border-b border-zinc-800 p-2">
        <h4 className="font-medium text-sm">Text Settings</h4>
      </div>

      <div className="p-4 space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Font Family</Label>
          <Select value={fontFamily} onValueChange={onFontFamilyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map(font => (
                <SelectItem key={font} value={font}>
                  <span style={{ fontFamily: font }}>{font}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Font Size</Label>
            <span className="text-xs text-zinc-400">{fontSize}px</span>
          </div>
          <Slider
            value={[fontSize]}
            min={8}
            max={144}
            step={1}
            onValueChange={(value) => onFontSizeChange(value[0])}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-8 h-8 p-0.5"
            />
            <Input
              type="text"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <div className="border rounded p-3 bg-zinc-800/50">
          <div 
            className="w-full text-center break-words"
            style={{ 
              fontFamily,
              fontSize: `${fontSize}px`,
              color
            }}
          >
            Sample Text
          </div>
        </div>
      </div>
    </div>
  )
} 