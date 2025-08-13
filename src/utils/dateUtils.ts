import dayjs from 'dayjs'
import 'dayjs/locale/th'

// Types
interface WorkRange {
  begin: string
  quit?: string
}

interface TranslationFunction {
  (key: string): string
}

// Constants
const BUDDHIST_YEAR_OFFSET = 543

// Helper Functions
export const isNewJob = (begin: string): boolean => {
  return dayjs(begin).diff(dayjs(), 'second') > 0
}

const getSequentialDuration = (baseBegin: dayjs.Dayjs, baseEnd: dayjs.Dayjs) => {
  let cursor = baseBegin

  const year = baseEnd.diff(cursor, 'year')
  cursor = cursor.add(year, 'year')

  const month = baseEnd.diff(cursor, 'month')
  cursor = cursor.add(month, 'month')

  const day = baseEnd.diff(cursor, 'day')

  return { year, month, day }
}

const applyBuddhistYearOffset = (date: dayjs.Dayjs, langName: string): dayjs.Dayjs => {
  return langName === 'th' ? date.add(BUDDHIST_YEAR_OFFSET, 'year') : date
}

const formatDateRange = (
  baseBegin: dayjs.Dayjs,
  baseEnd: dayjs.Dayjs,
  quit: string | undefined,
  langName: string,
  dayOnly: boolean,
  t: TranslationFunction
): string => {
  const dateBegin = applyBuddhistYearOffset(baseBegin, langName)
  const dateQuit = applyBuddhistYearOffset(baseEnd, langName)

  const formatPattern = dayOnly ? 'D MMMM YYYY' : 'MMMM YYYY'
  const formattedBegin = dateBegin.format(formatPattern)
  const formattedQuit = quit
    ? dateQuit.format(formatPattern)
    : t('date.present')

  return `${formattedBegin} — ${formattedQuit}`
}

// Main Functions
export const getWorkPeriod = (
  range: WorkRange,
  langName: string,
  t: TranslationFunction
): string => {
  const { begin, quit } = range

  if (isNewJob(begin)) {
    return `Start in ${dayjs(begin).fromNow(true)}`
  }

  const baseBegin = dayjs(begin)
  const baseEnd = quit ? dayjs(quit) : dayjs()

  const { year, month } = getSequentialDuration(baseBegin, baseEnd)
  const dayOnly = !month && !year

  return formatDateRange(baseBegin, baseEnd, quit, langName, dayOnly, t)
}

export const getWorkDuration = (
  range: WorkRange,
  langName: string,
  t: TranslationFunction
): string => {
  const { begin, quit } = range

  if (isNewJob(begin)) {
    return `Start in ${dayjs(begin).fromNow(true)}`
  }

  const baseBegin = dayjs(begin)
  const baseEnd = quit ? dayjs(quit) : dayjs()

  const { year, month, day } = getSequentialDuration(baseBegin, baseEnd)

  const yearText = year ? ` ${year} ${t('date.year')}` : ''
  const monthText = month ? ` ${month} ${t('date.month')}` : ''
  const dayText = day && !year ? ` ${day} ${t('date.day')}` : ''

  const durationText = (yearText + monthText + dayText).trim()

  return durationText ? ` ( ${durationText} )` : ''
}