/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { DataTableView } from '../data-table-view'

const columns = [{ accessorKey: 'name', header: 'Name' }]
const data: { name: string }[] = []

function EmptyTable(props: { customContent: boolean }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTableView
      table={table}
      emptyTitle='No records'
      emptyContent={props.customContent ? <p>No records</p> : undefined}
    />
  )
}

describe('table empty state', () => {
  it.each([
    ['default', false],
    ['custom', true],
  ] as const)(
    'does not tint the whole %s empty row on hover',
    (_label, customContent) => {
      render(<EmptyTable customContent={customContent} />)

      const emptyRow = screen.getByText('No records').closest('tr')
      expect(emptyRow).toHaveClass('hover:[background-color:transparent]')
      expect(emptyRow?.className).not.toContain(
        'hover:[background-color:color-mix('
      )
    }
  )
})
