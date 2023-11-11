import { useAtomValue } from "jotai"
import { FC } from "react"
import { atoms } from "../store"
import { cn } from "./utils"

interface ImageViewerProps {
  className?: string
}

export const ImageViewer: FC<ImageViewerProps> = ({ className }) => {
  const image = useAtomValue(atoms.image)
  const livePreviews = useAtomValue(atoms.livePreviews)

  return (
    <div className={cn("relative flex", className)}>
      {image && !livePreviews.length && (
        <img className="w-full h-full object-contain" src={image.url} alt={image.url} />
      )}
      {livePreviews.map((preview) => (
        <img
          key={preview.url}
          className="absolute top-0 left-0 w-full h-full object-contain"
          src={preview.url}
          alt="Live Preview"
        />
      ))}
      {!image && !livePreviews.length && <div className="absolute-center">no image</div>}
    </div>
  )
}
