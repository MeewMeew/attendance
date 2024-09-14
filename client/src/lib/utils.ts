import type { Table, Updater } from '@tanstack/vue-table'
import { type ClassValue, clsx } from 'clsx'
import { lowerCase, toString } from 'lodash-es'
import { twMerge } from 'tailwind-merge'
import type { Ref } from 'vue'

import type { U } from '@/shared/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function valueUpdater<T extends Updater<any>>(updaterOrValue: T, ref: Ref) {
  ref.value = typeof updaterOrValue === 'function' ? updaterOrValue(ref.value) : updaterOrValue
}

export function highlightMatching<T extends unknown>(input: any, table: Table<T>) {
  const filter = table.getState().globalFilter as string
  const value = input || ''
  if (!filter) return value
  return toString(value).replace(
    new RegExp(`(${lowerCase(filter)})`, 'gi'),
    (match) => `<mark>${match}</mark>`
  )
}

export function getAcronym(name?: string): string {
  if (!name) return ''
  if (name.indexOf(' ') === -1) return name.slice(0, 2).toUpperCase()
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export function generatePath<Path extends string>(
  originalPath: Path,
  params: {
    [key in U.Path.PathParam<Path>]: string | null
  } = {} as any
): string {
  let path: string = originalPath
  if (path.endsWith('*') && path !== '*' && !path.endsWith('/*')) {
    console.warn(
      false,
      `Route path "${path}" will be treated as if it were ` +
        `"${path.replace(/\*$/, '/*')}" because the \`*\` character must ` +
        'always follow a `/` in the pattern. To get rid of this warning, ' +
        `please change the route path to "${path.replace(/\*$/, '/*')}".`
    )
    path = path.replace(/\*$/, '/*') as Path
  }
  const prefix = path.startsWith('/') ? '/' : ''
  const stringify = (p: any) => (p == null ? '' : typeof p === 'string' ? p : String(p))
  const segments = path
    .split(/\/+/)
    .map((segment, index, array) => {
      const isLastSegment = index === array.length - 1
      if (isLastSegment && segment === '*') {
        const star = '*' as U.Path.PathParam<Path>
        return stringify(params[star])
      }

      const keyMatch = segment.match(/^:([\w-]+)(\??)$/)
      if (keyMatch) {
        const [, key, optional] = keyMatch
        const param = params[key as U.Path.PathParam<Path>]
        invariant(optional === '?' || param != null, `Missing ":${key}" param`)
        return stringify(param)
      }
      return segment.replace(/\?$/g, '')
    })
    .filter((segment) => !!segment)
  return prefix + segments.join('/')
}

export function invariant(value: boolean, message?: string): asserts value
export function invariant<T>(value: T | null | undefined, message?: string): asserts value is T
export function invariant(value: any, message?: string) {
  if (value === false || value === null || typeof value === 'undefined') {
    throw new Error(message)
  }
}
