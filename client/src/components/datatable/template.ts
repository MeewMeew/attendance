import type { CellContext, ColumnDef } from '@tanstack/vue-table'
import { createColumnHelper } from '@tanstack/vue-table'
import { nanoid } from 'nanoid'
import { h } from 'vue'

import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { generatePath, highlightMatching } from '@/lib/utils'
import { t } from '@/shared/locales'
import type { Other } from '@/shared/types'

import DataTableColumnHeader from './DataTableColumnHeader.vue'

const columnHelper = createColumnHelper<unknown>()

export const selectColumn = columnHelper.display({
  id: 'select',
  header: ({ table }) =>
    h(Checkbox, {
      checked:
        table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
      'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
      ariaLabel: 'Select all',
      class: 'translate-y-0.5'
    }),
  cell: ({ row }) =>
    h(Checkbox, {
      checked: row.getIsSelected(),
      'onUpdate:checked': (value) => row.toggleSelected(!!value),
      ariaLabel: 'Select row',
      class: 'translate-y-0.5'
    }),
  enableSorting: false,
  enableHiding: false
})

export function createColumns<T>(
  ...optionsList: Other.DataTable.ColumnHeader.CreateColumnOptions<T>[]
) {
  const columnsDef: ColumnDef<unknown>[] = []
  for (const {
    accessorKey = '',
    id = nanoid(),
    align = 'left',
    size = 'md',
    bold = true,
    truncate = true,
    enableColumnFilter = true,
    enableSorting = true,
    enableHiding = true,
    isSelectColumn = false,
    isActionsColumn = false,
    meta = {},
    ...restOptions
  } of optionsList) {
    const columnDef = {
      id: accessorKey || id,
      accessorKey: accessorKey,
      header: ({ column, table }) => {
        if (meta.hidden) {
          column.toggleVisibility(false)
          delete meta.hidden
        }

        if (isSelectColumn)
          return h(Checkbox, {
            checked:
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate'),
            'onUpdate:checked': (value) => table.toggleAllPageRowsSelected(!!value),
            ariaLabel: 'Select all',
            class: 'translate-y-0.5'
          })

        return h(DataTableColumnHeader, {
          column: column as any,
          title: t(meta?.title || accessorKey)
        })
      },
      cell:
        restOptions.cell ||
        ((context: CellContext<T, T>) => {
          if (isSelectColumn)
            return h(Checkbox, {
              checked: context.row.getIsSelected(),
              'onUpdate:checked': (value) => context.row.toggleSelected(!!value),
              ariaLabel: 'Select row',
              class: 'translate-y-0.5'
            })
          let value = ''
          if (typeof restOptions.inputValue === 'function') {
            value = restOptions.inputValue(context)
          } else if (restOptions.inputValue) {
            value = restOptions.inputValue
          } else if (accessorKey !== '') {
            value = context.row.getValue(accessorKey!) as string
          }
          t(value.toString())
          return h(TooltipProvider, {}, () => [
            h(Tooltip, {}, () => [
              h(TooltipTrigger, {}, () => [
                h('p', {
                  class: {
                    'w-full': true,
                    'text-left': align === 'left',
                    'text-center': align === 'center',
                    'text-right': align === 'right',
                    'max-w-[50px]': size === 'sm',
                    'max-w-[150px]': size === 'md',
                    'max-w-[200px]': size === 'lg',
                    'max-w-[300px]': size === 'xl',
                    'max-w-[400px]': size === '2xl',
                    'max-w-[500px]': size === '3xl',
                    'font-medium': bold,
                    truncate: truncate
                  },
                  innerHTML: highlightMatching(value, context.table)
                })
              ]),
              h(TooltipContent, {}, () => {
                return h('p', { innerHTML: value })
              })
            ])
          ])
        }),
      enableColumnFilter: isActionsColumn ? false : enableColumnFilter,
      enableSorting: isActionsColumn ? false : enableSorting,
      enableHiding: isSelectColumn || isActionsColumn ? false : enableHiding,
      meta: meta
    } as ColumnDef<unknown>
    columnsDef.push(columnDef)
  }
  return columnsDef
}

export const createRowActions = (
  options: Other.DataTable.RowAction.Options
): Other.DataTable.RowAction.Actions => {
  const { type, id, allowDelete, who = 'admin', sync } = options

  const actions: Other.DataTable.RowAction.Actions = {
    update: {
      label: 'components.datatable.row_actions.update',
      to: generatePath('/:who/:type/update/:id', { type: type, id: id, who: who })
    },
    view: {
      label: 'components.datatable.row_actions.view',
      to: generatePath('/:who/:type/view/:id', { type: type, id: id, who: who })
    },
    delete: allowDelete
  }

  if (sync) {
    actions.sync = {
      label: 'components.datatable.row_actions.sync',
      to: generatePath('/:who/:type/sync/:id', { type: type, id: id, who: who })
    }
  }

  return actions
}
