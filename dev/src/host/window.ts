export interface WindowMetrics {
  x: number
  y: number
  width: number
  height: number
}

export function saveWindowMetrics(metrics: WindowMetrics) {
  localStorage.setItem("windowMetrics", JSON.stringify(metrics))
}

export function getWindowMetrics(): WindowMetrics {
  const data = localStorage.getItem("windowMetrics")
  if (data) {
    return JSON.parse(data) as WindowMetrics
  }

  return {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  }
}
