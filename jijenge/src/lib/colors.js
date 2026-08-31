const PALETTE = [
  '#F2A691', '#A8C7A0', '#F0D46A', '#9CB8E0',
  '#C6A6D9', '#F0B080', '#8FD0C4', '#D9B48F',
  '#E39EB9', '#8FC9E0', '#B5D99C', '#F4C27F',
]

/** Deterministically pick a tile color from the handle string */
export function colorForHandle(handle) {
  let h = 0
  for (let i = 0; i < handle.length; i++) {
    h = (h * 31 + handle.charCodeAt(i)) >>> 0
  }
  return PALETTE[h % PALETTE.length]
}

/** First two characters to display inside a filled tile */
export function initialsFor(handle) {
  return handle.replace(/^@/, '').slice(0, 2).toUpperCase()
}
