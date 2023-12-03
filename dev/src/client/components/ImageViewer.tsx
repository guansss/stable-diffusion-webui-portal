import { useAtomValue } from "jotai"
import type { FC } from "react"
import { atoms } from "../store"
import { cn } from "./utils"

interface ImageViewerProps {
  className?: string
}

export const ImageViewer: FC<ImageViewerProps> = ({ className }) => {
  const image = useAtomValue(atoms.image)
  const livePreview = useAtomValue(atoms.livePreview)
  const progress = useAtomValue(atoms.progress)

  return (
    <div className={cn("relative flex", className)}>
      {image && !livePreview && (
        <img className="w-full h-full object-contain" src={image.url} alt={image.url} />
      )}
      {livePreview && (
        <img
          key={livePreview.url}
          className="absolute top-0 left-0 w-full h-full object-contain"
          src={livePreview.url}
          alt="Live Preview"
        />
      )}
      {!image && !livePreview && <div className="absolute-center">no image</div>}
      {progress && (
        <div className="absolute top-0 left-0 font-bold text-white drop-shadow-sm">
          {progress.text}
        </div>
      )}
    </div>
  )
}
