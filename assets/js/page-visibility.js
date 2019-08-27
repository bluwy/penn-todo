// Currently not able to remove a specific listener
// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

let hidden
let visibilityChange
let events = {}

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
   * @param {string} key Listener key
   * @param {(hidden: boolean) => void} listener On visibility change listener
   */
  addListener (key, listener) {
    this.removeListener(key)
    events[key] = () => listener(document[hidden])
    document.addEventListener(visibilityChange, events[key])
  },
  /**
   * Remove listener from visibility change events
   * @param {string} key Listener key
   */
  removeListener (key) {
    const listener = events[key]
    if (listener) {
      document.removeEventListener(visibilityChange, listener)
      events[key] = null
    }
  },
  /**
   * Remove all listeners from visibility change events
   */
  removeAllListeners () {
    for (const key in events) {
      document.removeEventListener(visibilityChange, events[key])
    }
    events = {}
  }
}
