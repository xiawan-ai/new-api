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
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { CTA } from '../components/sections/cta'

async function renderCTA(isAuthenticated = false) {
  const route = createRootRoute({
    component: () => <CTA isAuthenticated={isAuthenticated} />,
  })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  render(<RouterProvider router={router} />)
}

describe('home call to action', () => {
  it('continues the light paper and cream section rhythm instead of a dark color block', async () => {
    await renderCTA()
    const heading = await screen.findByRole('heading', { level: 2 })

    expect(heading.closest('section')).toHaveClass(
      'bg-paper',
      'text-foreground',
      'border-t'
    )
    expect(heading.closest('section')).not.toHaveClass('bg-primary')
    expect(screen.getByText('your first request?')).toHaveClass(
      'text-muted-foreground'
    )
    expect(
      screen.getByRole('button', { name: 'Get your API key' })
    ).toHaveClass('bg-primary', 'text-primary-foreground')
  })

  it('preserves the guest sign-up and price-list destinations', async () => {
    await renderCTA()

    expect(
      await screen.findByRole('button', { name: 'Get your API key' })
    ).toHaveAttribute('href', '/sign-up')
    expect(
      screen.getByRole('link', { name: 'See models and prices' })
    ).toHaveAttribute('href', '/pricing')
  })

  it('does not invite an authenticated user to create another account', async () => {
    await renderCTA(true)

    expect(screen.queryByRole('heading', { level: 2 })).not.toBeInTheDocument()
    expect(
      screen.queryByRole('button', { name: 'Get your API key' })
    ).not.toBeInTheDocument()
  })
})
