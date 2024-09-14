import { forEach, isPlainObject, toString, upperCase } from 'lodash-es'

import type { Utils } from '@/shared/types'
interface NestedObject {
  [key: string]: any
}

export function removeUndefinedValues(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== undefined))
}

export function mergeObjects<T, U>(first: T, second: U): T & U {
  return { ...second, ...first }
}

export function mergeOptions<T>(defaults: T, overrides: Partial<T>): T {
  const result = { ...defaults }

  for (const key in overrides) {
    if (overrides[key] !== undefined) {
      result[key] = overrides[key]!
    }
  }

  return result
}

export function flattenObject(
  obj: NestedObject,
  parentKey: string = '',
  result: NestedObject = {}
): NestedObject {
  forEach(obj, (value, key) => {
    const newKey = parentKey ? `${parentKey}.${key}` : key
    if (isPlainObject(value)) flattenObject(value, newKey, result)
    else result[newKey] = value
  })
  return result
}

export function protectSourceCode() {
  if (import.meta.env.PROD) {
    setInterval(() => {
      const before = new Date().getTime()
      debugger
      const after = new Date().getTime()
      if (after - before > 100) {
        document.querySelector('html')!.innerHTML = ''
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      }
    }, 1000)
  }
}

export function nameToEmail(name: string, domain: string): string {
  if (!name || !domain) return ''
  const en = viToEn(name)
  return `${en.trim().split(/\s+/).pop()?.toLowerCase() || ''}${en
    .trim()
    .split(/\s+/)
    .slice(0, -1)
    .map((part) => part[0]?.toLowerCase())
    .join('')}@${domain}`
}

export function nameToCode(name: string): string {
  return name
    .split(/\s+/g)
    .map((n) => upperCase(n[0]))
    .join('')
}

export function viToEn(s: string) {
  s = s
    .toLowerCase()
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '')
  return s
}

export function toShortName(name: string) {
  return name
    .split(/\s+/g)
    .map((n) => upperCase(n[0]))
    .join('')
}

export function toPerfectTime(hours: string, minutes?: string) {
  if (minutes) return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`
  return hours
    .split(':')
    .map((t) => t.padStart(2, '0'))
    .join(':')
}

export function startCase(s: any) {
  return toString(s)
    .toLowerCase()
    .split(/\s+/g)
    .map((n) => upperCase(n[0]) + n.slice(1))
    .join(' ')
}

export function extractLabels(path: string): Utils.Path.WithLabel[] {
  const segments = path.split('/')
  const labels: Utils.Path.WithLabel[] = []
  let currentPath = ''
  segments.forEach((segment) => {
    if (segment !== '') {
      currentPath += `/${segment}`
      const formattedSegment = segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      labels.push({ path: currentPath, label: formattedSegment })
    }
  })
  return labels
}