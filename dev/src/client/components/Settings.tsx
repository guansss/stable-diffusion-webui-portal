import { DialogDescription } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import type { ResizeMode } from "../../utils/window"
import { atoms } from "../store"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Label } from "./ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"

interface SettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const resizeModeOptions = {
  "fit-image": {
    label: "Fit image",
    description: "Resize the window to fit the image.",
  },
  "screen-width": {
    label: "Screen width",
    description:
      "Resize the window to the width of the screen, keeping the same aspect ratio as the image.",
  },
  "screen-height": {
    label: "Screen height",
    description:
      "Resize the window to the height of the screen, keeping the same aspect ratio as the image.",
  },
} satisfies Record<ResizeMode, unknown>

export function Settings({ open, onOpenChange }: SettingsProps) {
  const [resizeMode, setResizeMode] = useAtom(atoms.resizeMode)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Changes will be automatically saved.</DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resizeMode" className="text-right">
                Resize window
              </Label>
              <Select
                name="resizeMode"
                value={resizeMode}
                onValueChange={(v) => setResizeMode(v as keyof typeof resizeModeOptions)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue>{resizeModeOptions[resizeMode]?.label}</SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[400px]">
                  {Object.entries(resizeModeOptions).map(([value, { label, description }]) => (
                    <SelectItem key={value} value={value} description={description}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
