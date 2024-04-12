import React from "react"
import { cn } from "../utils"

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement>

export const Link = ({ className, ...props }: LinkProps) => {
  return <a className={cn("text-primary underline hover:opacity-80", className)} {...props} />
}
