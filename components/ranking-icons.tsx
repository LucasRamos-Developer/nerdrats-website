import type React from "react"
import { Route, Keyboard } from "lucide-react"

export function DistanceIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Route {...props} />
}

export function TypeIcon(props: React.SVGProps<SVGSVGElement>) {
  return <Keyboard {...props} />
}
