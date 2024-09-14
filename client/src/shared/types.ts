import type { CellContext, Column, ColumnDef, Row, Table } from '@tanstack/vue-table'
import type { DocumentSnapshot } from 'firebase/firestore'
import type { Schema as ExcelSchema } from 'read-excel-file'
import type { Component, VNode } from 'vue'
import type { RouteLocationRaw, RouteMeta } from 'vue-router'

namespace Management {
  export namespace Class {
    export type Base = Omit<Info, 'classId'>
    export interface Info {
      classId: string
      batchId: string
      facultyId: string
      instructorId: string
      name: string
      shortName: string
      capacity: number
    }
  }

  export namespace Classroom {
    export interface Base {
      name: string
      used: boolean | string
      state: '' | 'idle' | 'fetching' | 'active'
      location: string
      capacity: number
    }
    export interface Info extends Base {
      classroomId: string
    }
  }

  export namespace Faculty {
    export interface Info {
      facultyId: string
      name: string
      shortName: string
    }
  }

  export namespace Batch {
    export interface Base {
      name: string
      shortName: string
      startYear: number
      endYear: number
    }
    export type Info = Base & {
      batchId: string
    }
  }

  export namespace Course {
    export interface Base {
      name: string
      code: string
      credit: number
    }
    export interface Info extends Base {
      courseId: string
    }
  }

  export namespace Schedule {
    export interface Base {
      classId: string
      courseId: string
      classroomId: string
      instructorId: string
      facultyId: string
      batchId: string
      date: string
      startTime: string
      endTime: string
      method: 'practice' | 'theory'
    }
    export interface Info extends Base {
      scheduleId: string
    }
  }

  export namespace Attendance {
    export type Status = 'present' | 'late' | 'absent'
    export interface Base {
      sessionId: string
      scheduleId: string
      cacheId?: string
    }

    export interface WithStudent extends Base {
      attendanceId: string
      studentId: string
      status: Status
      note: string
      time: string
    }

    export interface WithClass extends Base {
      summary: Summary
      attendances: WithStudent[]
    }

    export interface Summary {
      present: number
      late: number
      total: number
    }
  }

  export namespace User {
    export type Role = 'admin' | 'instructor' | 'student' | 'all'
    export interface Primitive {
      email: string
      displayName: string
      phoneNumber: string
    }

    export interface Base extends Primitive {
      role: Role
      photoURL: string
      createdAt: string
      loginInfo: LoginInfo
    }

    export interface LoginInfo {
      ip: string
      time: string
      deviceId: string
      deviceName: string
    }

    export type WithPassword = Base & {
      password: string
    }

    export type BaseWithRole<T extends Role = 'all'> = Base &
      (T extends 'student'
        ? {
          role: 'student'
        }
        : T extends 'instructor'
        ? {
          role: 'instructor'
        }
        : {
          role: 'admin'
        })

    export type Info<T extends Role = 'all'> = Base &
      (T extends 'student'
        ? {
          role: 'student'
          studentId: string
          batchId: string
          facultyId: string
          classId: string
        }
        : T extends 'instructor'
        ? {
          role: 'instructor'
          instructorId: string
          facultyId: string
        }
        : {}) & {
          docId: string
        }
  }

  export namespace Student {
    export interface Base {
      docId: string
      studentId: string
      batchId: string
      facultyId: string
      classId: string
    }

    export type WithBatchData = Base & {
      batch: Batch.Info
    }

    export type WithFacultyData = Base & {
      faculty: Faculty.Info
    }

    export type WithClassData = Base & {
      class: Class.Info
    }

    export type WithAllData = Base & {
      batch: Batch.Info
      class: Class.Info
      faculty: Faculty.Info
    }

    export type WithUserData = Base & {
      user: User.Info<'student'>
    }
  }

  export namespace Instructor {
    export interface Base {
      docId: string
      instructorId: string
      facultyId: string
    }

    export type WithFacultyData = Base & {
      faculty: Faculty.Info
    }

    export type WithUserData = Base & {
      user: User.Info<'instructor'>
    }
  }

  // Shorten URL
  export namespace Shorten {
    export type Type = 'attendance' | 'room-sync'
    export interface Base {
      data: string
      type: Type
    }

    export interface Info extends Base {
      docId: string
    }
  }
}

namespace Firebase {
  export type NextFn<T> = (value: T) => void

  export type ErrorFn = (error: Error) => void

  export type CompleteFn = () => void

  export interface Observer<T> {
    next: NextFn<T>
    error: ErrorFn
    complete: CompleteFn
  }

  export type NextOrObserver<T> = NextFn<T | null> | Observer<T | null>

  export type Unsubscribe = () => void

  export type DocData<T> = DocumentSnapshot<T>

  export interface QuerySnapshot<T> {
    docs: DocData<T>[]
  }

  export namespace Auth {
    export type Error = {
      code: string
      message: string
    }
  }
}

namespace Other {
  export namespace Theme {
    export type Color =
      | 'green'
      | 'blue'
      | 'red'
      | 'zinc'
      | 'orange'
      | 'rose'
      | 'slate'
      | 'stone'
      | 'gray'
      | 'neutral'
      | 'yellow'
      | 'violet'

    export interface Info {
      color: Color
      dark: boolean
      label: 'dark' | 'light'
    }
  }

  export namespace Menu {
    export interface ItemBase {
      label: string
      icon?: VNode
    }

    export interface RouteItem extends ItemBase {
      route: string
      children?: never
    }

    export interface GroupItem extends ItemBase {
      route?: never
      children: Item[]
    }

    export type Item = RouteItem | GroupItem

    export type List = Item[]

    export interface MenuItemProps {
      item: Item
      index: number
    }
  }

  export namespace DataTable {
    export namespace RowAction {
      export interface Options {
        type: string
        id: string
        allowDelete?: boolean
        who?: Management.User.Role
        sync?: boolean
      }

      export interface Route {
        label: string
        to: string | RouteLocationRaw
      }

      export interface Actions {
        update: Route
        view: Route
        delete?: boolean
        sync?: Route
      }

      export interface Props {
        id: string
        actions: Actions
        row: Row<unknown>
        name: string
        remove: (id: string) => Promise<any> | void
      }

      export interface Emits {
        (event: 'accept-delete'): void
        (event: 'cancel-delete'): void
      }

      export interface Expose {
        close: () => void
      }
    }

    export namespace ViewOption {
      export interface Props {
        table: Table<unknown>
      }

      export namespace Column {
        export interface Meta {
          title: string
        }
      }
    }

    export namespace Toolbar {
      export interface Props {
        hideCreate?: boolean
        table: Table<unknown>
        actor: string
        facetedFilters?: FacetedFilter.Props & {
          columnName: string
        }
        tableOptions?: {
          idToDelete?: string
          funcToDelete?: (id: string) => Promise<any>
        }
        customActions?: Component
      }

      export interface Emits {
        (event: 'update:custom-actions', ...args: any[]): void
      }
    }

    export namespace Pagination {
      export interface Props {
        table: Table<unknown>
      }
    }

    export namespace FacetedFilter {
      export interface Props {
        column?: Column<unknown>
        title: string
        options: Option[]
      }

      export interface Option {
        label: string
        value: string
        icon?: Component | VNode
      }
    }

    export namespace ColumnHeader {
      export interface Props {
        column?: Column<unknown>
        title?: string
        inheritAttrs?: boolean
      }
      /**
       * Options for creating a text column.
       */
      export interface CreateColumnOptions<T> {
        /**
         * The key used to access the data for this column.
         * @example "name"
         */
        accessorKey?: string

        /**
         * An optional unique identifier for the column.
         * If not provided, a default ID may be generated.
         * @example "column-1"
         */
        id?: string

        /**
         * The size of the column.
         * 'sm' for small, 'md' for medium, 'lg' for large, 'xl' for extra large,
         * '2xl' for double extra large, and '3xl' for triple extra large.
         * @default "md"
         * @example "lg"
         */
        size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

        /**
         * The min width of the column.
         * 'sm' for small, 'md' for medium, 'lg' for large, 'xl' for extra large,
         * '2xl' for double extra large, and '3xl' for triple extra large.
         * @default "md"
         * @example "lg"
         */
        minWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

        /**
         * If true, the text in the column will be bold.
         * @default true
         * @example false
         */
        bold?: boolean

        /**
         * If true, the text in the column will be truncated if it overflows.
         * @default true
         * @example false
         */
        truncate?: boolean

        /**
         * The alignment of the text in the column.
         * 'left' for left, 'center' for center, and 'right' for right.
         * @default "left"
         */
        align?: 'left' | 'center' | 'right'

        /**
         * A function that returns the value to display in the column.
         * If not provided, the value from the row data will be used.
         * @example (row) => row.getValue('name').toUpperCase()
         * @example 'name'
         */
        inputValue?: InputValue<T> | string

        /**
         * A function that returns the node in cell.
         * @example (row) => row.getValue('name').toUpperCase()
         */
        cell?: CellValue<T>

        /**
         * Meta object that contains information about the column.
         * @example { title: 'Name' }
         */
        meta?: {
          title?: string
          hidden?: boolean
          [key: string]: any
        }

        /**
         * If true, table will allow you hide this table
         * @default false
         * @example true
         */
        enableHiding?: boolean

        /**
         * If true, table will allow you to filter this table
         * @default false
         * @example true
         */
        enableColumnFilter?: boolean

        /**
         * If true, table will allow you to sort this table
         * @default false
         * @example true
         */
        enableSorting?: boolean

        /**
         * If true, this column will be is select column
         * @default false
         * @example true
         */
        isSelectColumn?: boolean

        /**
         * If true, this column will be is actions column
         * @default false
         * @example true
         */
        isActionsColumn?: boolean
      }

      interface InputValue<T> {
        (context: CellContext<T, T>): string
      }

      interface CellValue<T> {
        (context: CellContext<T, T>): void
      }
    }

    export interface Props {
      columns: ColumnDef<unknown>[]
      data: unknown[]
      toolbar: Omit<Toolbar.Props, 'table'>

      name: string
      idToDelete?: string
      funcToDelete?: (id: string) => Promise<any>
    }

    export interface Emits {
      (event: 'update:custom-actions', ...args: any[]): void
    }
  }

  export namespace Execl {
    export interface ReadError {
      row: number
      column: string
      error: string
      value?: any
    }
  }
}

namespace Utils {
  //transform an object structure into a dot-separated string type representation
  export type Dotify<T, Cache extends string = ''> = T extends PropertyKey
    ? Cache
    : {
      [P in keyof T]: P extends string
      ? Cache extends ''
      ? Dotify<T[P], `${P}`>
      : Cache | Dotify<T[P], `${Cache}.${P}`>
      : never
    }[keyof T]

  export type InferExcelSchema<T extends ExcelSchema> = {
    [K in keyof T as T[K] extends { prop: infer P }
    ? P extends string
    ? P
    : never
    : never]: T[K] extends { type: infer U }
    ? U extends (value: any) => any
    ? ReturnType<U>
    : U extends typeof String
    ? string
    : U extends typeof Number
    ? number
    : any
    : never
  }
  export namespace Path {
    type Base = {
      path: string
    }

    type _PathParam<Path extends string> =
      // split path into individual path segments
      Path extends `${infer L}/${infer R}`
      ? _PathParam<L> | _PathParam<R>
      : // find params after `:`
      Path extends `:${infer Param}`
      ? Param extends `${infer Optional}?`
      ? Optional
      : Param
      : // otherwise, there aren't any params present
      never

    /**
     * Examples:
     * "/a/b/*" -> "*"
     * ":a" -> "a"
     * "/a/:b" -> "b"
     * "/a/blahblahblah:b" -> "b"
     * "/:a/:b" -> "a" | "b"
     * "/:a/b/:c/*" -> "a" | "c" | "*"
     */
    export type PathParam<Path extends string> =
      // check if path is just a wildcard
      Path extends '*' | '/*'
      ? '*'
      : // look for wildcard at the end of the path
      Path extends `${infer Rest}/*`
      ? '*' | _PathParam<Rest>
      : // look for params in the absence of wildcards
      _PathParam<Path>
    // Attempt to parse the given string segment. If it fails, then just return the
    // plain string type as a default fallback. Otherwise, return the union of the
    // parsed string literals that were referenced as dynamic segments in the route.
    export type ParamParseKey<Segment extends string> =
      // if you could not find path params, fallback to `string`
      [PathParam<Segment>] extends [never] ? string : PathParam<Segment>

    /**
     * The parameters that were parsed from the URL path.
     */
    export type Params<Key extends string = string> = {
      readonly [key in Key]: string | undefined
    }

    export type WithLabel = Base & {
      label: string
    }

    export type ListLabel = WithLabel[]
    export type TwoChildListLable = [WithLabel[], WithLabel[]]
  }

  export namespace Route {
    export type GenerateOptions<T> = {
      type: T extends 'main' | 'root' | 'catch' ? T : 'root'
      path: string
      parent?: string
      component?: Promise<any>
      meta?: RouteMeta
      children?: RouteLocationRaw[]
    }

    export type ErrorRouteOptions = {
      path: '/:pathMatch(.*)*'
    }
  }

  export namespace Views {
    export type Method = 'create' | 'update' | 'view' | 'sync'
    export type MethodUpdateView = Extract<Method, 'update' | 'view'>
    export type MethodSyncView = Extract<Method, 'sync'>

    export interface FormCommonProps { }
  }
}

namespace Axios {
  export interface Error {
    response: {
      data: UnprocessableEntity
    }
  }

  export interface UnprocessableEntity {
    type: 'validation'
    on: 'body' | 'user' | string
    property: string
    message: string
    errors: UnprocessableEntityError[]
  }

  export interface UnprocessableEntityError {
    message: string
    path: string
    type: number
    schema: {
      type: string
    }
  }
}

export type QalendarConfig = {
  locale: string
  defaultMode: string
  showCurrentTime: boolean
  style: {
    colorSchemes: Partial<Record<QalendarColorScheme, QalendarColorSchemeInfo>>
  }
}

export type QalendarColorScheme =
  | 'zinc'
  | 'rose'
  | 'blue'
  | 'green'
  | 'orange'
  | 'red'
  | 'slate'
  | 'stone'
  | 'gray'
  | 'neutral'
  | 'yellow'
  | 'violet'
export type QalendarColorSchemeInfo = {
  color: string
  backgroundColor: string
}

export enum Transition {
  FADE_LEFT = 'fade-left',
  FADE_RIGHT = 'fade-right',
  FADE_UP = 'fade-up',
  FADE_DOWN = 'fade-down'
}

export type {
  Axios as A,
  Firebase as F,
  Firebase,
  Management as M,
  Management,
  Other as O,
  Other,
  Utils as U,
  Utils
}
