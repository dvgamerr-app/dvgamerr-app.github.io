import dayjs from 'dayjs'
import 'dayjs/locale/th'

export const isNewJob = (begin: string) => dayjs(begin).diff(dayjs(), 'second') > 0

export const getWorkPeriod = (range: { begin: string; quit?: string }, langName: string, t: any) => {
  const { begin, quit } = range

  if (isNewJob(begin)) {
    return `Start in ${dayjs(begin).fromNow(true)}`
  }

  // Use original dates for accurate diff, apply Buddhist year shift only for display
  const baseBegin = dayjs(begin)
  const baseEnd = quit ? dayjs(quit) : dayjs()

  // Sequential diff to avoid rounding issues with average month length
  let cursor = baseBegin
  const year = baseEnd.diff(cursor, 'year')
  cursor = cursor.add(year, 'year')
  const month = baseEnd.diff(cursor, 'month')
  cursor = cursor.add(month, 'month')
  const day = baseEnd.diff(cursor, 'day')

  const dayOnly = !month && !year

  const yearText = year ? ` ${year} ${t('date.year')}` : ''
  const monthText = month ? ` ${month} ${t('date.month')}` : ''
  const dayText = day && !year ? ` ${day} ${t('date.day')}` : ''

  const dateBegin = baseBegin.add(langName == 'th' ? 543 : 0, 'year')
  const dateQuit = baseEnd.add(langName == 'th' ? 543 : 0, 'year')

  const formattedBegin = dateBegin.format(`${dayOnly ? 'D ' : ''}MMMM YYYY`)
  const durationText = (yearText + monthText + dayText).trim()
  const formattedQuit = quit
    ? `${dateQuit.format(`${dayOnly ? 'D ' : ''}MMMM YYYY`)} ( ${durationText} )`
    : `${t('date.present')}${durationText ? ` ( ${durationText} )` : ''}`

  return `${formattedBegin} — ${formattedQuit}`
}
