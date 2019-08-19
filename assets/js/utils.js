/**
 * Debounce function calls
 * @param {Function} fn Function to be debounced
 * @param {number} wait Debounce time
 */
export function debounce (fn, wait) {
  let t
  return function () {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, arguments), wait)
  }
}

/**
 * Throttle function calls (No trailing)
 * @param {Function} fn Function to be throttled
 * @param {number} wait Throttle time
 */
export function throttle (fn, wait) {
  let t
  return function () {
    if (!t) {
      fn.apply(this, arguments)
      t = setTimeout(() => { t = null }, wait)
    }
  }
}

/**
 * Syntactic sugar for setTimeout
 * @param {number} wait Wait time
 * @param {(end: Function) => {}} [endCb] Exposes the end function, equivalent to clearTimeout
 */
export function wait (wait, endCb) {
  return new Promise((resolve) => {
    const t = setTimeout(resolve, wait)
    if (endCb) {
      endCb(() => {
        clearTimeout(t)
        resolve()
      })
    }
  })
}
