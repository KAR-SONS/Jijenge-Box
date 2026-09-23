import { useEffect, useRef } from 'react'

export default function AdBanner() {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    // Prevent double-injection on React StrictMode remounts
    if (ref.current.querySelector('script')) return

    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = 'https://pl31137447.profitableratecpmnetwork.com/795fa2b2abd351bce35f6bfc898d13c9/invoke.js'
    // ☝️ Replace with the exact script URL from your Adsterra Native Banner ad unit

    ref.current.appendChild(script)
  }, [])

  return (
    <div className="ad-banner-wrap">
      <div className="ad-label">Sponsored</div>
      <div ref={ref} />
    </div>
  )
}
