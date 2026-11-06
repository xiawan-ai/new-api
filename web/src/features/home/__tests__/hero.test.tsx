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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'

import { Hero } from '../components/sections/hero'

// Links render as plain anchors so each action's destination can be read
// without mounting a router.
vi.mock('@tanstack/react-router', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@tanstack/react-router')>()),
  Link: ({
    to,
    children,
    ...rest
  }: {
    to: string
    children?: ReactNode
    className?: string
  }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}))

function renderHero(options: {
  isAuthenticated: boolean
  serverAddress?: string
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(STATUS_QUERY_KEY, {
    server_address: options.serverAddress,
  })
  render(
    <QueryClientProvider client={client}>
      <Hero isAuthenticated={options.isAuthenticated} />
    </QueryClientProvider>
  )
}

function linkFor(label: string): HTMLAnchorElement | null {
  return screen.getByText(label).closest('a')
}

beforeEach(() => {
  localStorage.clear()
  // jsdom has no canvas backend; the decorative background must cope.
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)
})

describe('home hero', () => {
  it('offers a guest one headline with sign-up as the primary action and the price list as a link', () => {
    renderHero({ isAuthenticated: false })

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(linkFor('Get your API key')).toHaveAttribute('href', '/sign-up')
    expect(linkFor('See models and prices')).toHaveAttribute(
      'href',
      '/pricing'
    )
    expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument()
  })

  it('sends a signed-in user to the dashboard instead of sign-up', () => {
    renderHero({ isAuthenticated: true })

    expect(linkFor('Go to Dashboard')).toHaveAttribute('href', '/dashboard')
    expect(screen.queryByText('Get your API key')).not.toBeInTheDocument()
    expect(linkFor('See models and prices')).toHaveAttribute(
      'href',
      '/pricing'
    )
  })

  it('shows the configured server address as the base URL without a trailing slash', () => {
    renderHero({
      isAuthenticated: false,
      serverAddress: 'https://api.example.com/',
    })

    expect(screen.getByTestId('hero-base-url')).toHaveTextContent(
      'https://api.example.com'
    )
    expect(
      screen.getByRole('button', { name: 'Copy base URL' })
    ).toBeInTheDocument()
  })

  it('falls back to the page origin when no server address is configured', () => {
    renderHero({ isAuthenticated: false })

    expect(screen.getByTestId('hero-base-url')).toHaveTextContent(
      window.location.origin
    )
  })

  it('hides the decorative background from assistive technology', () => {
    renderHero({ isAuthenticated: false })

    expect(document.querySelector('canvas')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })
})
