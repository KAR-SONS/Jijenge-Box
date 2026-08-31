const KEY = 'jijenge-device-id'
const CLAIM_KEY = 'jijenge-claimed-tile'

/** Returns a stable device ID, creating one if needed */
export function getDeviceId() {
  let id = localStorage.getItem(KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(KEY, id)
  }
  return id
}

/** Remember which tile index this device claimed */
export function saveClaimedTile(tileIndex) {
  localStorage.setItem(CLAIM_KEY, String(tileIndex))
}

/** Returns the tile index this device claimed, or null */
export function getClaimedTile() {
  const v = localStorage.getItem(CLAIM_KEY)
  return v !== null ? Number(v) : null
}

/** Has this device already claimed a tile? */
export function hasClaimedTile() {
  return localStorage.getItem(CLAIM_KEY) !== null
}
