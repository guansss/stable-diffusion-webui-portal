import { useAtomValue, useSetAtom } from "jotai"
import { useCallback, type FC } from "react"
import { watchControls } from "../event"
import { atoms } from "../store"
import { cn } from "./utils"

interface ImageViewerProps {
  className?: string
}

export const ImageViewer: FC<ImageViewerProps> = ({ className }) => {
  const image = useAtomValue(atoms.image)
  const setImageSize = useSetAtom(atoms.imageSize)
  const livePreview = useAtomValue(atoms.livePreview)
  const progress = useAtomValue(atoms.progress)

  const containerRef = useCallback((element: HTMLDivElement | null) => {
    if (element) {
      watchControls(element)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn("relative flex", className)}>
      {image && !livePreview && (
        <img
          className="w-full h-full object-contain"
          src={image.url}
          alt={image.url}
          onLoad={(e) =>
            setImageSize({
              width: e.currentTarget.naturalWidth,
              height: e.currentTarget.naturalHeight,
            })
          }
        />
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
