import { useEffect, useState, useCallback } from 'react'
import { client, fetchBoxes, fetchKing, DB, BOXES_COL, KING_COL } from '../lib/appwrite'

const GRID_SIZE = Number(import.meta.env.VITE_GRID_SIZE) || 300

/**
 * Returns:
 *   boxes  — Map<tileIndex, boxDoc>
 *   king   — king doc or null
 *   loading
 *   error
 *   refresh — manual refetch
 */
export function useGrid() {
  const [boxes, setBoxes]   = useState(new Map())
  const [king, setKing]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const [docs, kingDoc] = await Promise.all([fetchBoxes(), fetchKing()])
      const map = new Map()
      docs.forEach(d => map.set(d.tileIndex, d))
      setBoxes(map)
      setKing(kingDoc)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()

    // Appwrite Realtime — subscribe to both collections
    const boxChannel  = `databases.${DB}.collections.${BOXES_COL}.documents`
    const kingChannel = `databases.${DB}.collections.${KING_COL}.documents`

    const unsubscribe = client.subscribe([boxChannel, kingChannel], event => {
      const doc = event.payload

      if (event.channels.some(c => c.includes(BOXES_COL))) {
        // A box was created
        if (event.events.some(e => e.includes('create'))) {
          setBoxes(prev => {
            const next = new Map(prev)
            next.set(doc.tileIndex, doc)
            return next
          })
        }
      }

      if (event.channels.some(c => c.includes(KING_COL))) {
        // King was updated or created
        if (event.events.some(e => e.includes('create') || e.includes('update'))) {
          setKing(doc)
        }
      }
    })

    return () => unsubscribe()
  }, [load])

  return { boxes, king, loading, error, refresh: load, gridSize: GRID_SIZE }
}
