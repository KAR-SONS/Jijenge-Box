import { useState } from 'react'
import { claimBox } from '../lib/appwrite'
import { colorForHandle } from '../lib/colors'
import { getDeviceId, saveClaimedTile } from '../lib/device'

function normalizeUrl(raw) {
  const v = raw.trim()
  if (!v) return null
  const prefixed = /^https?:\/\//i.test(v) ? v : `https://${v}`
  try { new URL(prefixed); return prefixed } catch { return null }
}

export default function ClaimModal({ tileIndex, onClose, onClaimed }) {
  const [handle, setHandle] = useState('')
  const [url, setUrl]       = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverErr, setServerErr] = useState(null)

  function validate() {
    const e = {}
    const h = handle.trim().replace(/^@/, '')
    if (!h || h.length > 24) e.handle = 'Give yourself a handle (max 24 chars).'
    if (!normalizeUrl(url))  e.url    = "That doesn't look like a valid link."
    return e
  }

  async function submit() {
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setErrors({})
    setServerErr(null)
    setLoading(true)

    const h      = handle.trim().replace(/^@/, '')
    const fullUrl = normalizeUrl(url)
    const color  = colorForHandle(h)
    const deviceId = getDeviceId()

    try {
      const doc = await claimBox({ tileIndex, handle: h, url: fullUrl, color, deviceId })
      saveClaimedTile(tileIndex)
      onClaimed(doc)
    } catch (err) {
      setServerErr(err.message.includes('already') || err.code === 409
        ? 'Someone just grabbed that tile — pick another one!'
        : 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay open" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <h3>Claim plot #{tileIndex + 1}</h3>
        <p className="modal-sub">One handle, one link. That's it.</p>

        <div className={`field ${errors.handle ? 'invalid' : ''}`}>
          <label htmlFor="handle-input">Your handle</label>
          <input
            id="handle-input"
            type="text"
            placeholder="yourname"
            maxLength={24}
            value={handle}
            onChange={e => setHandle(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            autoFocus
          />
          {errors.handle && <span className="field-err">{errors.handle}</span>}
        </div>

        <div className={`field ${errors.url ? 'invalid' : ''}`}>
          <label htmlFor="url-input">Your link</label>
          <input
            id="url-input"
            type="text"
            placeholder="instagram.com/yourname"
            value={url}
            onChange={e => setUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          {errors.url && <span className="field-err">{errors.url}</span>}
        </div>

        {serverErr && <p className="server-err">{serverErr}</p>}

        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-solid" onClick={submit} disabled={loading}>
            {loading ? 'Claiming…' : 'Claim plot'}
          </button>
        </div>
      </div>
    </div>
  )
}
