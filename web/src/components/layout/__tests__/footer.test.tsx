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
import i18next from 'i18next'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import zh from '@/i18n/locales/zh.json'
import { STATUS_QUERY_KEY } from '@/lib/status-query'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import { Footer } from '../components/footer'

const originalConfig = useSystemConfigStore.getState()
let client: QueryClient

beforeEach(async () => {
  await i18next.changeLanguage('en')
  localStorage.clear()
  client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  })
})

afterEach(async () => {
  await i18next.changeLanguage('en')
  client.clear()
  useSystemConfigStore.setState(originalConfig, true)
  localStorage.clear()
})

async function renderFooter(
  options: {
    footerHtml?: string
    legalEnabled?: boolean
    systemName?: string
    showFilings?: boolean
  } = {}
) {
  useSystemConfigStore.setState({
    config: {
      systemName: options.systemName ?? 'Finch Token',
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
  const route = createRootRoute({
    component: () => <Footer showFilings={options.showFilings} />,
  })
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
    'hides both filing records and the badge by default while keeping copyright in the %s footer',
    async (_mode, footerHtml) => {
      const footer = await renderFooter({ footerHtml })

      expect(footer).toHaveTextContent(
        footerHtml
          ? 'Finch Token · Site copyright'
          : 'Finch Agent · 虾丸科技（深圳）有限公司'
      )
      expect(footer).not.toHaveTextContent('粤公网安备44030002018453号')
      expect(footer).not.toHaveTextContent('粤ICP备2026152027号-1')
      expect(footer.querySelector('a[href^="https://beian."]')).toBeNull()
      expect(footer.querySelector('img[src="/beian-gongan.png"]')).toBeNull()
    }
  )

  it('shows the official company footer without framework placeholders when backend configuration is unavailable', async () => {
    const footer = await renderFooter({ systemName: 'New API' })

    expect(footer).toHaveTextContent('Finch Agent · 虾丸科技（深圳）有限公司')
    expect(footer).not.toHaveTextContent('New API')
    expect(footer).not.toHaveTextContent('Powerful API Management Platform')
  })

  it('matches the official Chinese copyright wording', async () => {
    i18next.addResourceBundle('zh', 'translation', zh.translation, true, true)
    await i18next.changeLanguage('zh')
    const footer = await renderFooter()

    expect(footer).toHaveTextContent(
      'Finch Agent · 虾丸科技（深圳）有限公司 保留所有权利'
    )
  })

  it('keeps the compact footer free of a decorative divider and its extra padding', async () => {
    const footer = await renderFooter({ showFilings: true })
    const filingGroup = within(footer).getByRole('link', {
      name: '粤ICP备2026152027号-1',
    }).parentElement

    expect(filingGroup?.parentElement).not.toHaveClass('border-t')
    expect(filingGroup?.parentElement).not.toHaveClass('pt-6')
    expect(footer.querySelector('hr')).toBeNull()
  })

  it('wraps filing links below the copyright on narrow screens', async () => {
    const footer = await renderFooter({ showFilings: true })
    const filingGroup = within(footer).getByRole('link', {
      name: '粤ICP备2026152027号-1',
    }).parentElement

    expect(filingGroup).toHaveClass('min-w-0', 'flex-wrap')
    expect(filingGroup?.parentElement).toHaveClass('flex-col', 'lg:flex-row')
  })
  it.each([
    ['default', undefined],
    ['custom', '<p>Finch Token · Site copyright</p>'],
  ] as const)(
    'restores filings without a project attribution when explicitly enabled in the %s footer',
    async (_mode, footerHtml) => {
      const footer = await renderFooter({ footerHtml, showFilings: true })

      expect(footer).toHaveTextContent(
        footerHtml
          ? 'Finch Token · Site copyright'
          : 'Finch Agent · 虾丸科技（深圳）有限公司'
      )
      const publicSecurity = within(footer).getByRole('link', {
        name: '粤公网安备44030002018453号',
      })
      const icp = within(footer).getByRole('link', {
        name: '粤ICP备2026152027号-1',
      })
      expect(publicSecurity).toHaveAttribute(
        'href',
        'https://beian.mps.gov.cn/#/query/webSearch?code=44030002018453'
      )
      expect(icp).toHaveAttribute('href', 'https://beian.miit.gov.cn/')
      for (const link of [publicSecurity, icp]) {
        expect(link).toHaveAttribute('target', '_blank')
        expect(link).toHaveAttribute('rel', 'noopener noreferrer')
      }
      const badge = publicSecurity.querySelector('img')
      expect(badge).toHaveAttribute('src', '/beian-gongan.png')
      expect(badge).toHaveAttribute('alt', '')
      expect(badge).toHaveAttribute('width', '20')
      expect(badge).toHaveAttribute('height', '20')
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
    expect(agreement.parentElement).toHaveClass('flex-wrap')
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
