// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
let hidden
let visibilityChange

if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden'
  visibilityChange = 'visibilitychange'
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden'
  visibilityChange = 'msvisibilitychange'
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden'
  visibilityChange = 'webkitvisibilitychange'
}

export default {
  /**
   * Add listener to visibility change events
   * @param {(hidden: boolean) => void} listener On visibility change listener
   */
  addListener (listener) {
    document.addEventListener(visibilityChange, () => listener(document[hidden]))
  }
}
