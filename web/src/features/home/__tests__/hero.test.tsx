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

function renderHero(options: { isAuthenticated: boolean; docsLink?: string }) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(STATUS_QUERY_KEY, { docs_link: options.docsLink })
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
  it('offers a guest one headline with sign-up as the primary action and pricing as a link', () => {
    renderHero({ isAuthenticated: false })

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(linkFor('Get Started')).toHaveAttribute('href', '/sign-up')
    expect(linkFor('View Pricing')).toHaveAttribute('href', '/pricing')
    expect(screen.queryByText('Go to Dashboard')).not.toBeInTheDocument()
  })

  it('sends a signed-in user to the dashboard and drops the sign-up and pricing actions', () => {
    renderHero({ isAuthenticated: true })

    expect(linkFor('Go to Dashboard')).toHaveAttribute('href', '/dashboard')
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument()
    expect(screen.queryByText('View Pricing')).not.toBeInTheDocument()
  })

  it('opens an external docs address in a new tab', () => {
    renderHero({
      isAuthenticated: false,
      docsLink: 'https://docs.example.com',
    })

    const docs = linkFor('Docs')
    expect(docs).toHaveAttribute('href', 'https://docs.example.com')
    expect(docs).toHaveAttribute('target', '_blank')
    expect(docs).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('keeps an in-app docs address in the same tab', () => {
    renderHero({ isAuthenticated: false, docsLink: '/docs' })

    const docs = linkFor('Docs')
    expect(docs).toHaveAttribute('href', '/docs')
    expect(docs).not.toHaveAttribute('target')
  })

  it('hides the decorative background from assistive technology', () => {
    renderHero({ isAuthenticated: false })

    expect(document.querySelector('canvas')).toHaveAttribute(
      'aria-hidden',
      'true'
    )
  })
})
