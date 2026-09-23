import { useState } from 'react'
import { openPaystackPopup } from '../lib/paystack'
import { crownKing } from '../lib/appwrite'
import { getDeviceId, hasClaimedTile, getClaimedTile } from '../lib/device'

const AMOUNT = Number(import.meta.env.VITE_OVERTHROW_AMOUNT) || 50

export default function KingSpotlight({ king, boxes, onOverthrown, onFindRandom }) {
  const [paying, setPaying] = useState(false)
  const [err, setErr] = useState(null)

  async function handleOverthrow() {
    if (!hasClaimedTile()) {
      setErr('Claim a tile first before you can take the throne.')
      return
    }

    const myTileIndex = getClaimedTile()
    const myBox = boxes.get(myTileIndex)
    if (!myBox) {
      setErr("Couldn't find your tile. Try refreshing.")
      return
    }

    // Don't pay to overthrow yourself
    if (king && king.tileIndex === myTileIndex) {
      setErr("You're already the king!")
      return
    }

    setErr(null)
    setPaying(true)
    try {
      const ref = await openPaystackPopup({
        email: `${getDeviceId()}@jijengebbox.app`, // anonymous email required by Paystack
        amountKes: AMOUNT,
        metadata: { tileIndex: myTileIndex, handle: myBox.handle },
      })

      await crownKing({
        tileIndex: myTileIndex,
        handle: myBox.handle,
        url: myBox.url,
        color: myBox.color,
        paystackRef: ref,
      })

      onOverthrown?.()
    } catch (e) {
      if (e.message !== 'Payment window closed') setErr(e.message)
    } finally {
      setPaying(false)
    }
  }

  const hasKing = king && boxes.has(king.tileIndex)

  return (
    <div className="king-spotlight">
      <div className="king-left">
        <div className="crown-badge">👑</div>
        <div className="king-info">
          <div className="king-label">king of the grid - Be the first every user sees</div>
          {hasKing ? (
            <>
              <div className="king-name">@{king.handle}</div>
              <a
                className="king-link"
                href={king.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {king.url.replace(/^https?:\/\//, '')}
              </a>
            </>
          ) : (
            <div className="king-name empty">No one's taken the throne yet</div>
          )}
        </div>
      </div>

      <div className="king-actions">
        {err && <span className="king-err">{err}</span>}
        <button className="btn btn-ghost" onClick={onFindRandom}>
          Find random plot
        </button>
        <button className="btn btn-gold" onClick={handleOverthrow} disabled={paying}>
          {paying ? 'Opening payment…' : `Overthrow king · KES ${AMOUNT}`}
        </button>
      </div>
    </div>
  )
}
