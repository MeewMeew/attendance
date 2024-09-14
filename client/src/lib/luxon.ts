import { DateTime } from 'luxon'

export function isDateInRange(
  date: string,
  rangeStart: string,
  rangeEnd: string,
  format: string = 'yyyy-MM-dd HH:mm'
) {
  const dt = DateTime.fromFormat(date, format)
  const start = DateTime.fromFormat(rangeStart, format)
  const end = DateTime.fromFormat(rangeEnd, format)
  return dt >= start && dt <= end
}

export function isDateInAnyRange(
  date: string,
  ranges: { start: string; end: string }[],
  format: string = 'yyyy-MM-dd HH:mm'
) {
  return ranges.some((range) => isDateInRange(date, range.start, range.end, format))
}

export function isDateBefore(date: string, target: string, format: string = 'yyyy-MM-dd HH:mm') {
  const dt = DateTime.fromFormat(date, format)
  const tg = DateTime.fromFormat(target, format)
  return dt < tg
}

export function isDateAfter(date: string, target: string, format: string = 'yyyy-MM-dd HH:mm') {
  const dt = DateTime.fromFormat(date, format)
  const tg = DateTime.fromFormat(target, format)
  return dt > tg
}

export function isDateAfterTargetPlusMinutes(
  date: string,
  target: string,
  minutes: number,
  format: string = 'yyyy-MM-dd HH:mm'
) {
  const dt = DateTime.fromFormat(date, format)
  const tg = DateTime.fromFormat(target, format).plus({ minutes })
  return dt > tg
}

export function combineDateAndTime(
  date: string,
  time: string,
  format: string = 'yyyy-MM-dd HH:mm'
) {
  const dt = DateTime.fromFormat(date, 'yyyy-MM-dd')
  const tm = DateTime.fromFormat(time, 'HH:mm')
  return dt.set({ hour: tm.hour, minute: tm.minute }).toFormat(format)
}

export function time(time: string, format: string = 'yyyy-MM-dd HH:mm') {
  return DateTime.fromFormat(time, format)
}

export function timeNow() {
  return DateTime.now()
}

export function timeNowFormat(format: string = 'yyyy-MM-dd HH:mm') {
  return timeNow().toFormat(format)
}
