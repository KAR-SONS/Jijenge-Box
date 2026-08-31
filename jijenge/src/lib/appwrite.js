import { Client, Databases, Query, ID } from 'appwrite'

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)

export const databases = new Databases(client)
export { client, Query, ID }

export const DB   = import.meta.env.VITE_APPWRITE_DATABASE_ID
export const BOXES_COL = import.meta.env.VITE_APPWRITE_BOXES_COLLECTION_ID
export const KING_COL  = import.meta.env.VITE_APPWRITE_KING_COLLECTION_ID

// ── Boxes ────────────────────────────────────────────────────────────────────

/** Fetch all claimed boxes (up to 300) */
export async function fetchBoxes() {
  const res = await databases.listDocuments(DB, BOXES_COL, [
    Query.limit(Number(import.meta.env.VITE_GRID_SIZE) || 300),
  ])
  return res.documents // [{ $id, tileIndex, handle, url, color, deviceId }]
}

/** Claim a tile — throws if tileIndex already taken */
export async function claimBox({ tileIndex, handle, url, color, deviceId }) {
  return databases.createDocument(DB, BOXES_COL, ID.unique(), {
    tileIndex,
    handle,
    url,
    color,
    deviceId,
  })
}

// ── King ─────────────────────────────────────────────────────────────────────

const KING_DOC_ID = 'current' // we use a fixed doc ID so there's always exactly one

/** Fetch the current king doc (null if none) */
export async function fetchKing() {
  try {
    return await databases.getDocument(DB, KING_COL, KING_DOC_ID)
  } catch (e) {
    if (e.code === 404) return null
    throw e
  }
}

/**
 * Crown a new king.
 * Creates the doc on first call, updates it on subsequent calls.
 * @param {{ tileIndex: number, handle: string, url: string, color: string, paystackRef: string }} data
 */
export async function crownKing({ tileIndex, handle, url, color, paystackRef }) {
  const payload = { tileIndex, handle, url, color, paystackRef, crowndAt: new Date().toISOString() }
  try {
    return await databases.updateDocument(DB, KING_COL, KING_DOC_ID, payload)
  } catch (e) {
    if (e.code === 404) {
      return await databases.createDocument(DB, KING_COL, KING_DOC_ID, payload)
    }
    throw e
  }
}
