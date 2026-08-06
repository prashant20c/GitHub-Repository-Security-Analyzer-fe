export function getApiErrorMessage(error, fallback = 'Something went wrong.') {
  const responseData = error?.response?.data

  if (!responseData) {
    return error?.message || fallback
  }

  if (typeof responseData === 'string') {
    return responseData
  }

  if (responseData.message) {
    return responseData.message
  }

  if (responseData.error) {
    return responseData.error
  }

  if (responseData.errors && typeof responseData.errors === 'object') {
    const messages = Object.values(responseData.errors)
      .flat()
      .filter(Boolean)

    if (messages.length) {
      return messages.join(' ')
    }
  }

  return fallback
}
