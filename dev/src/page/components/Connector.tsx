import { useAtomValue } from "jotai"
import type { FC } from "react"
import { useEffect, useState } from "react"
import { pageRpc } from "../page-rpc"
import { atoms } from "../store"
import { Button } from "./ui/Button"

export const Connector: FC = () => {
  const connected = useAtomValue(atoms.connected)

  const [error, setError] = useState("")

  const connect = () => {
    setError("")

    pageRpc.initPage().catch((err: unknown) => {
      setError(String(err))
    })
  }

  useEffect(() => {
    connect()
  }, [])

  if (connected) return null

  return (
    <>
      {!error && <div className="absolute-center">Connecting...</div>}
      {error && (
        <div className="absolute-center">
          <h2 className="text-lg text-red-500">Error: could not connect to host</h2>
          <p>{error}</p>
          <Button className="mt-4" onClick={connect}>
            Retry
          </Button>
        </div>
      )}
    </>
  )
}
