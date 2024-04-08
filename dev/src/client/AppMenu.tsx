import { useAtomValue } from "jotai"
import { ScalingIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"
import { resizeWindow } from "../utils/window"
import { resizeModeOptions, Settings } from "./components/Settings"
import { Button } from "./components/ui/Button"
import { atoms } from "./store"

export function AppMenu() {
  const resizeMode = useAtomValue(atoms.resizeMode)
  const imageSize = useAtomValue(atoms.imageSize)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 right-0 pb-12 group">
      <div className="flex flex-wrap bg-[var(--background)] p-2 gap-2 z-10 shadow-lg transition-transform -translate-y-full group-hover:translate-y-0">
        <Button
          variant="outline"
          onClick={() => resizeWindow(resizeMode, imageSize.width, imageSize.height)}
        >
          <ScalingIcon className="w-4 h-4 mr-2" />
          Resize window ({resizeModeOptions[resizeMode]?.label})
        </Button>
        <Button variant="outline" onClick={() => setSettingsOpen(true)}>
          <SettingsIcon className="w-4 h-4 mr-2" />
          Settings...
        </Button>

        <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
      </div>
    </div>
  )
}
