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
import { renderHook } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useAuthStore } from '@/stores/auth-store'

import { useTopNavLinks } from '../use-top-nav-links'

let client: QueryClient

function renderLinks(headerNavModules?: string) {
  client.setQueryData(STATUS_QUERY_KEY, {
    HeaderNavModules: headerNavModules,
  })
  return renderHook(() => useTopNavLinks(), {
    wrapper: (props: { children: ReactNode }) => (
      <QueryClientProvider client={client}>
        {props.children}
      </QueryClientProvider>
    ),
  })
}

beforeEach(() => {
  localStorage.clear()
  useAuthStore.getState().auth.reset()
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
})

afterEach(() => {
  client.clear()
  useAuthStore.getState().auth.reset()
  localStorage.clear()
})

describe('top navigation', () => {
  it.each([
    ['missing navigation configuration', undefined],
    ['malformed navigation configuration', '{invalid'],
    ['enabled About entry', '{"about":true}'],
  ])('shows About with %s', (_condition, configuration) => {
    const { result } = renderLinks(configuration)

    expect(result.current.map((link) => link.href)).toEqual([
      '/',
      '/dashboard',
      '/pricing',
      '/rankings',
      '/about',
    ])
  })

  it('hides About when the control panel disables it without changing other entries', () => {
    const { result } = renderLinks('{"about":false}')

    expect(result.current.map((link) => link.href)).toEqual([
      '/',
      '/dashboard',
      '/pricing',
      '/rankings',
    ])
  })

  it('shows About to signed-in users when the control panel enables it', () => {
    useAuthStore.getState().auth.setUser({
      id: 1,
      username: 'navigation-user',
      role: 1,
    })
    const { result } = renderLinks('{"about":true,"rankings":false}')

    expect(result.current.map((link) => link.href)).toEqual([
      '/',
      '/dashboard',
      '/pricing',
      '/about',
    ])
  })

  it('preserves disabled modules and the login requirement for the remaining model entry', () => {
    const { result } = renderLinks(
      JSON.stringify({
        home: false,
        console: false,
        pricing: { enabled: true, requireAuth: true },
        rankings: false,
        about: false,
      })
    )

    expect(result.current).toEqual([
      { title: 'Model Square', href: '/pricing', requiresAuth: true },
    ])
  })
})
