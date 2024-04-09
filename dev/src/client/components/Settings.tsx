import { DialogDescription } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import { useId } from "react"
import type { ResizeMode } from "../../utils/window"
import { atoms } from "../store"
import { applyTheme, type Theme } from "../theme"
import { stopWatchingWindowMetrics, watchWindowMetrics } from "../window"
import { Checkbox } from "./ui/Checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Label } from "./ui/Label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/Select"

interface SettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const themeOptions = {
  light: { label: "Light" },
  dark: { label: "Dark" },
  system: { label: "System" },
} satisfies Record<Theme, unknown>

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
  const [theme, setTheme] = useAtom(atoms.theme)
  const [resizeMode, setResizeMode] = useAtom(atoms.resizeMode)
  const [rememberWindowMetrics, setRememberWindowMetrics] = useAtom(atoms.rememberWindowMetrics)

  const themeId = useId()
  const resizeModeId = useId()
  const rememberWindowMetricsId = useId()

  const updateTheme = (theme: Theme) => {
    setTheme(theme)
    applyTheme(theme)
  }

  const updateRememberWindowMetrics = (enabled: boolean) => {
    setRememberWindowMetrics(enabled)

    if (enabled) {
      watchWindowMetrics()
    } else {
      stopWatchingWindowMetrics()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Changes will be automatically saved.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[max-content,auto] items-center gap-4 py-4">
          <Label htmlFor={themeId} className="text-right">
            Theme
          </Label>
          <Select value={theme} onValueChange={(v) => updateTheme(v as keyof typeof themeOptions)}>
            <SelectTrigger id={themeId}>
              <SelectValue>{themeOptions[theme]?.label}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(themeOptions).map(([value, { label }]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Label htmlFor={resizeModeId} className="text-right">
            Resize window
          </Label>
          <Select
            value={resizeMode}
            onValueChange={(v) => setResizeMode(v as keyof typeof resizeModeOptions)}
          >
            <SelectTrigger id={resizeModeId}>
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

          <Label htmlFor={rememberWindowMetricsId} className="text-right">
            Remember window position and size
          </Label>
          <Checkbox
            id={rememberWindowMetricsId}
            checked={rememberWindowMetrics}
            className="!w-5 !h-5"
            onCheckedChange={(checked) => updateRememberWindowMetrics(checked === true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
