import { useAtomValue } from "jotai"
import { FC, useEffect, useState } from "react"
import { pageRpc } from "../page-rpc"
import { atoms } from "../store"
import { useToast } from "./ui/use-toast"
import { Button } from "./ui/button"

export const Connector: FC = () => {
  const connected = useAtomValue(atoms.connected)
  const { toast } = useToast()

  const [error, setError] = useState("")

  const connect = () => {
    setError("")

    pageRpc.initPage().catch((err) => {
      setError(err.message)
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
