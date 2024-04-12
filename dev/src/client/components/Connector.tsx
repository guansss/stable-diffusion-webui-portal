import { useAtomValue } from "jotai"
import type { FC } from "react"
import { useEffect, useState } from "react"
import { formatError, isBirpcTimeoutError } from "../../utils/error"
import { clientRpc } from "../client-rpc"
import { atoms } from "../store"
import { Button } from "./ui/Button"

export const Connector: FC = () => {
  const connected = useAtomValue(atoms.connected)

  const [error, setError] = useState("")

  const connect = async () => {
    setError("")

    try {
      await clientRpc.initClient()
    } catch (e) {
      if (isBirpcTimeoutError(e)) {
        setError("Connection timed out.")
      } else {
        setError(formatError(e))
      }
    }
  }

  useEffect(() => {
    void connect()
  }, [])

  if (connected) return null

  return (
    <>
      {!error && <div className="absolute-center">Connecting...</div>}
      {error && (
        <div className="absolute-center">
          <h2 className="text-lg font-bold">Could not connect to host</h2>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => void connect()}>
            Retry
          </Button>
        </div>
      )}
    </>
  )
}
