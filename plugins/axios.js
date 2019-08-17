// Rejects the response data instead of the whole thing
export default function ({ $axios }) {
  $axios.onResponseError((e) => {
    return Promise.reject(e.response.data, e)
  })
}
