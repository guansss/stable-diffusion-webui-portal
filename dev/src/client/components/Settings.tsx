import { DialogDescription } from "@radix-ui/react-dialog"
import { useAtom } from "jotai"
import { InfoIcon } from "lucide-react"
import { useId } from "react"
import type { ResizeMode } from "../../utils/window"
import { atoms } from "../store"
import { applyTheme, type Theme } from "../theme"
import { stopWatchingWindowMetrics, watchWindowMetrics } from "../window"
import { Checkbox } from "./ui/Checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/Dialog"
import { Label } from "./ui/Label"
import { Link } from "./ui/Link"
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
      <DialogContent className="!max-w-[800px]">
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
          <details className="contents text-sm">
            <summary className="-mt-4 flex items-center justify-end self-start cursor-pointer text-orange-500">
              <InfoIcon className="w-4 h-4 mr-0.5" />
              Limitations
            </summary>
            <div className="-mt-4 p-2 bg-muted text-muted-foreground">
              Due to browser restrictions, regardless of the selected mode, when resizing:
              <ul className="list-disc pl-4">
                <li>The window can't be larger than the screen.</li>
                <li>The window can't span multiple screens.</li>
                <li>
                  The window can't perfectly fill the screen's width or height because there is a
                  minimum space (likely 8 pixels) between the window and the screen edges.
                </li>
              </ul>
            </div>
          </details>

          <Label htmlFor={rememberWindowMetricsId} className="text-right">
            Remember window position and size
          </Label>
          <Checkbox
            id={rememberWindowMetricsId}
            checked={rememberWindowMetrics}
            className="!w-5 !h-5"
            onCheckedChange={(checked) => updateRememberWindowMetrics(checked === true)}
          />
          <details className="contents text-sm">
            <summary className="-mt-4 flex items-center justify-end self-start cursor-pointer text-orange-500">
              <InfoIcon className="w-4 h-4 mr-0.5" />
              Limitations
            </summary>
            <div className="-mt-4 p-2 bg-muted text-muted-foreground">
              Due to browser restrictions, when opening the window with remembered position and
              size:
              <ul className="list-disc pl-4">
                <li>The window can't be larger than the screen.</li>
                <li>The window can't span multiple screens.</li>
                <li>
                  The window can't perfectly fill the screen's width or height because there is a
                  minimum space (likely 8 pixels) between the window and the screen edges.
                </li>
                <li>
                  Opening the window on a different screen is only supported on Chromium-based
                  browsers with version 100 or later. Firefox and Safari are not supported as of now
                  (April 2024). Check out the latest compatibility status{" "}
                  <Link
                    target="_blank"
                    href="https://developer.mozilla.org/en-US/docs/Web/API/Window_Management_API#browser_compatibility"
                  >
                    here
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </details>
        </div>
      </DialogContent>
    </Dialog>
  )
}
