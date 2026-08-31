/**
 * Opens the Paystack inline popup.
 * Resolves with the Paystack reference on success, rejects on close/failure.
 *
 * @param {{ email: string, amountKes: number, metadata?: object }} opts
 * @returns {Promise<string>} paystackRef
 */
export function openPaystackPopup({ email, amountKes, metadata = {} }) {
  return new Promise((resolve, reject) => {
    if (!window.PaystackPop) {
      reject(new Error('Paystack script not loaded'))
      return
    }

    const handler = window.PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
      email,
      // Paystack amount is in kobo (NGN) or pesewas (GHS) — for KES it's in cents, i.e. amount * 100
      amount: amountKes * 100,
      currency: 'KES',
      metadata,
      callback(response) {
        resolve(response.reference)
      },
      onClose() {
        reject(new Error('Payment window closed'))
      },
    })

    handler.openIframe()
  })
}
