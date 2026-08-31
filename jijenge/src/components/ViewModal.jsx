import { getClaimedTile } from '../lib/device'
import { initialsFor } from '../lib/colors'

export default function ViewModal({ box, onClose }) {
  if (!box) return null
  const isYours = getClaimedTile() === box.tileIndex

  return (
    <div className="overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal view-modal" role="dialog" aria-modal="true">
        {isYours && <span className="mine-badge">Your plot</span>}

        <div
          className="view-swatch"
          style={{ background: box.color }}
        >
          {initialsFor(box.handle)}
        </div>

        <p className="view-handle">@{box.handle}</p>
        <p className="view-link">{box.url.replace(/^https?:\/\//, '')}</p>

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Close</button>
          <a
            className="btn btn-solid"
            href={box.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open link
          </a>
        </div>
      </div>
    </div>
  )
}
