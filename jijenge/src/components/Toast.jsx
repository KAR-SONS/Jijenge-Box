import { useEffect, useState } from 'react'

let _setToast = null

export function showToast(msg) {
  _setToast?.(msg)
}

export default function Toast() {
  const [msg, setMsg]       = useState(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    _setToast = (m) => {
      setMsg(m)
      setVisible(true)
      setTimeout(() => setVisible(false), 2800)
    }
    return () => { _setToast = null }
  }, [])

  return (
    <div className={`toast${visible ? ' show' : ''}`} aria-live="polite">
      {msg}
    </div>
  )
}
