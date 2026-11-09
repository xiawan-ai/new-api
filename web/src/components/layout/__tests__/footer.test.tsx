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
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import { Footer } from '../components/footer'

const originalConfig = useSystemConfigStore.getState()
let client: QueryClient

beforeEach(() => {
  localStorage.clear()
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
})

afterEach(() => {
  client.clear()
  useSystemConfigStore.setState(originalConfig, true)
  localStorage.clear()
})

async function renderFooter(
  options: {
    footerHtml?: string
    legalEnabled?: boolean
  } = {}
) {
  useSystemConfigStore.setState({
    config: {
      systemName: 'Finch Token',
      logo: '/logo.png',
      footerHtml: options.footerHtml,
      demoSiteEnabled: false,
      currency: { ...DEFAULT_CURRENCY_CONFIG },
    },
    loadedLogoUrl: '/logo.png',
  })
  client.setQueryData(STATUS_QUERY_KEY, {
    user_agreement_enabled: options.legalEnabled ?? false,
    privacy_policy_enabled: options.legalEnabled ?? false,
  })
  const route = createRootRoute({ component: () => <Footer /> })
  const router = createRouter({
    routeTree: route,
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return screen.findByRole('contentinfo')
}

describe('site footer', () => {
  it.each([
    ['default', undefined],
    ['custom', '<p>Finch Token · Site copyright</p>'],
  ] as const)(
    'preserves site copyright without a project attribution in the %s footer',
    async (_mode, footerHtml) => {
      const footer = await renderFooter({ footerHtml })

      expect(footer).toHaveTextContent('Finch Token')
      expect(
        within(footer).queryByRole('link', { name: 'New API' })
      ).not.toBeInTheDocument()
      expect(
        footer.querySelector('a[href="https://github.com/QuantumNous/new-api"]')
      ).toBeNull()
      if (footerHtml) {
        expect(footer).toHaveTextContent('Site copyright')
      }
    }
  )

  it('keeps configured agreement and privacy links alongside custom copyright', async () => {
    const footer = await renderFooter({
      footerHtml: '<p>Finch Token · Site copyright</p>',
      legalEnabled: true,
    })
    const agreement = within(footer).getByRole('link', {
      name: 'User Agreement',
    })

    expect(agreement).toHaveAttribute('href', '/user-agreement')
    expect(
      within(footer).getByRole('link', { name: 'Privacy Policy' })
    ).toHaveAttribute('href', '/privacy-policy')
    expect(agreement.parentElement).toHaveClass('border-t', 'sm:border-l')
    expect(footer).toHaveTextContent('Site copyright')
  })

  it('does not leave an empty bordered column when legal links are disabled', async () => {
    const footer = await renderFooter({
      footerHtml: '<p>Finch Token · Site copyright</p>',
    })

    expect(footer.querySelector('[class~="sm:border-l"]')).toBeNull()
    expect(
      within(footer).queryByRole('link', { name: 'User Agreement' })
    ).not.toBeInTheDocument()
    expect(
      within(footer).queryByRole('link', { name: 'Privacy Policy' })
    ).not.toBeInTheDocument()
  })
})
