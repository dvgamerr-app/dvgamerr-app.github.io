import dayjs from 'dayjs'
import 'dayjs/locale/th'

export const isNewJob = (begin: string) => dayjs(begin).diff(dayjs(), 'second') > 0

export const getWorkPeriod = (range: { begin: string; quit?: string }, langName: string, t: any) => {
  const { begin, quit } = range

  if (isNewJob(begin)) {
    return `Start in ${dayjs(begin).fromNow(true)}`
  }

  const dateBegin = dayjs(begin).add(langName == 'th' ? 543 : 0, 'year')
  const dateQuit = dayjs(quit).add(langName == 'th' ? 543 : 0, 'year')

  let day = dateQuit.diff(dateBegin, 'day')
  let month = dateQuit.diff(dateBegin, 'month')
  const year = dateQuit.diff(dateBegin, 'year')
  const dayOnly = !month && !year

  if (!dayOnly) day = Math.round(day % 30.4377104) // (74year*365day + 25year*366day) / 99year / 12month
  if (year > 0) month %= 12

  const yearText = year ? ` ${year} ${t('date.year')}` : ''
  const monthText = month ? ` ${month} ${t('date.month')}` : ''
  const dayText = day && !year ? ` ${day} ${t('date.day')}` : ''

  const formattedBegin = dateBegin.format(`${dayOnly ? 'D ' : ''}MMMM YYYY`)
  const formattedQuit = quit
    ? `${dateQuit.format(`${dayOnly ? 'D ' : ''}MMMM YYYY`)} ( ${(yearText + monthText + dayText).trim()} )`
    : t('date.present')

  return `${formattedBegin} — ${formattedQuit}`
}
