import { useState, useRef } from 'react'
import { useGrid } from './hooks/useGrid'
import { hasClaimedTile } from './lib/device'
import Grid from './components/Grid'
import KingSpotlight from './components/KingSpotlight'
import ClaimModal from './components/ClaimModal'
import ViewModal from './components/ViewModal'
import Toast, { showToast } from './components/Toast'

export default function App() {
  const { boxes, king, loading, error, gridSize } = useGrid()

  const [claimIndex, setClaimIndex] = useState(null)
  const [viewBox, setViewBox]       = useState(null)
  const gridRef = useRef(null)

  function handleTileClick(index) {
    const box = boxes.get(index)
    if (box) {
      setViewBox(box)
    } else {
      if (hasClaimedTile()) {
        showToast('You already have a plot on this grid.')
        return
      }
      setClaimIndex(index)
    }
  }

  function handleClaimed(doc) {
    setClaimIndex(null)
    showToast(`Welcome to the grid, @${doc.handle}!`)
  }

  function handleFindRandom() {
    const filled = [...boxes.values()]
    if (!filled.length) { showToast('No plots claimed yet — be first!'); return }
    const pick = filled[Math.floor(Math.random() * filled.length)]
    const tile = gridRef.current?.querySelector(`[data-index="${pick.tileIndex}"]`)
    tile?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setViewBox(pick), 300)
  }

  function handleOverthrown() {
    showToast('You are the new king of Jijenge Box! 👑')
  }

  const claimed = boxes.size
  const pct     = Math.round((claimed / gridSize) * 100)

  return (
    <>
      <div className="wrap">
        <header className="top-bar">
          <div className="brand">JIJENGE<span className="brand-dot">.</span>BOX</div>
          <div className="stat-pill">
            <strong>{claimed}</strong> / {gridSize} plots claimed
          </div>
        </header>

        <section className="hero">
          <h1>Build your corner<br />of the internet.</h1>
          <p>
            Claim one small square, drop your most important link right now,
            and see who's holding the whole grid's attention as the random king.
          </p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-label">{pct}% of the grid is taken</div>
        </section>

        <KingSpotlight
          king={king}
          boxes={boxes}
          onOverthrown={handleOverthrown}
          onFindRandom={handleFindRandom}
        />

        <section className="grid-section">
          <div className="grid-header">
            <h2>The grid</h2>
            <p>Click an open plot to claim it. One plot per person.</p>
          </div>

          {loading && <div className="loading-state">Loading the grid…</div>}
          {error   && <div className="error-state">Couldn't load the grid: {error}</div>}

          {!loading && !error && (
            <div ref={gridRef}>
              <Grid
                boxes={boxes}
                king={king}
                gridSize={gridSize}
                onTileClick={handleTileClick}
              />
            </div>
          )}
        </section>

        <footer className="foot">
          <span>Jijenge Box — a shared public grid. Your link is visible to everyone.</span>
        </footer>
      </div>

      {claimIndex !== null && (
        <ClaimModal
          tileIndex={claimIndex}
          onClose={() => setClaimIndex(null)}
          onClaimed={handleClaimed}
        />
      )}

      {viewBox && (
        <ViewModal
          box={viewBox}
          onClose={() => setViewBox(null)}
        />
      )}

      <Toast />
    </>
  )
}
