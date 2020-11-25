export const parseDate = isoDate => {
  let date = new Date(isoDate)
  date = date.toString().split(' ')
  date.splice(4, 0, 'at')
  return date.slice(0, 6).join(' ')
}
