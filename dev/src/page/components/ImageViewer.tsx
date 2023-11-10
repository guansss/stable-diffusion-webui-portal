import { useAtomValue } from "jotai"
import { FC } from "react"
import { atoms } from "../store"
import { cn } from "./utils"

interface ImageViewerProps {
  className?: string
}

export const ImageViewer: FC<ImageViewerProps> = ({ className }) => {
  const image = useAtomValue(atoms.image)

  return (
    <div className={cn("relative flex", className)}>
      {image && <img className="w-full h-full object-contain" src={image.url} alt={image.url} />}
      {!image && <div className="absolute-center">no image</div>}
    </div>
  )
}
