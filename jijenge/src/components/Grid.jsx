import { initialsFor } from '../lib/colors'
import { getClaimedTile } from '../lib/device'

export default function Grid({ boxes, king, gridSize, onTileClick }) {
  const myTile = getClaimedTile()

  return (
    <div className="grid" role="list" aria-label="Jijenge Box grid">
      {Array.from({ length: gridSize }, (_, i) => {
        const box    = boxes.get(i)
        const isKing = king && king.tileIndex === i
        const isMine = myTile === i

        if (box) {
          return (
            <button
              key={i}
              role="listitem"
              className={`tile filled${isKing ? ' is-king' : ''}${isMine ? ' is-mine' : ''}`}
              style={{ background: box.color }}
              onClick={() => onTileClick(i)}
              title={`@${box.handle}`}
              aria-label={`@${box.handle}, claimed plot`}
            >
              <span className="tile-initials">{initialsFor(box.handle)}</span>
              {isKing && <span className="tile-crown">👑</span>}
            </button>
          )
        }

        return (
          <button
            key={i}
            role="listitem"
            className="tile empty"
            onClick={() => onTileClick(i)}
            aria-label={`Open plot ${i + 1}, click to claim`}
          >
            <span className="tile-plus">+</span>
          </button>
        )
      })}
    </div>
  )
}
