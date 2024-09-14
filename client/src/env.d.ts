/// <reference types="vite/client" />

declare module 'qalendar' {
  import * as qalendar from 'qalendar'
  export default qalendar
  export type { configInterface } from 'qalendar/dist/src/typings/config.interface.d.ts'
}
