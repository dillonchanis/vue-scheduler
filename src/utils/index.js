export const generateId = () => `_${Math.random().toString(36).substr(2, 9)}`

export const getMonths = (format = 'long') => {
  return {
    long: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    short: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }[format]
}

export const chunk = (arr, size = 7) => {
  const clone = [...arr]
  const result = []

  while (clone.length) {
    result.push(clone.splice(0, size))
  }

  return result
}
