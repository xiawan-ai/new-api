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
import { describe, expect, it, vi } from 'vitest'

import type { PricingData } from '@/features/pricing/types'
import { STATUS_QUERY_KEY } from '@/lib/status-query'

import { Models } from '../components/sections/models'

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

const pricing: PricingData = {
  success: true,
  data: [
    {
      id: 1,
      model_name: 'gpt-5-mini',
      vendor_id: 1,
      quota_type: 0,
      model_ratio: 0.125, // $0.25 / 1M input
      completion_ratio: 8, // $2 / 1M output
      enable_groups: ['default'],
    },
    {
      id: 2,
      model_name: 'per-request-image',
      vendor_id: 1,
      quota_type: 1,
      model_ratio: 1,
      completion_ratio: 1,
      model_price: 0.04,
      enable_groups: ['default'],
    },
  ],
  vendors: [{ id: 1, name: 'OpenAI' }],
  group_ratio: { default: 1 },
  usable_group: {},
  supported_endpoint: {},
  auto_groups: [],
}

function renderModels(options: {
  isAuthenticated?: boolean
  headerNavModules?: Record<string, unknown>
  withPricing?: boolean
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(STATUS_QUERY_KEY, {
    HeaderNavModules: options.headerNavModules,
    display_in_currency: true,
  })
  if (options.withPricing !== false) {
    client.setQueryData(['pricing'], pricing)
  }
  return render(
    <QueryClientProvider client={client}>
      <Models isAuthenticated={options.isAuthenticated} />
    </QueryClientProvider>
  )
}

describe('home models section', () => {
  it('lists token-billed models with input and output prices per million tokens', () => {
    renderModels({})

    expect(screen.getByText('gpt-5-mini')).toBeInTheDocument()
    expect(screen.queryByText('per-request-image')).not.toBeInTheDocument()
    expect(screen.getByText('Input').nextSibling).toHaveTextContent('$0.25')
    expect(screen.getByText('Output').nextSibling).toHaveTextContent('$2')
    expect(screen.getByText('See all models').closest('a')).toHaveAttribute(
      'href',
      '/pricing'
    )
  })

  it('renders nothing when the pricing page is disabled', () => {
    const { container } = renderModels({
      headerNavModules: { pricing: { enabled: false, requireAuth: false } },
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('asks a guest to sign in when the pricing page requires login', () => {
    renderModels({
      headerNavModules: { pricing: { enabled: true, requireAuth: true } },
      withPricing: false,
    })

    expect(
      screen.getByText('Sign in to see the full price list.')
    ).toBeInTheDocument()
    expect(screen.getByText('Sign in').closest('a')).toHaveAttribute(
      'href',
      '/sign-in'
    )
    expect(screen.queryByText('gpt-5-mini')).not.toBeInTheDocument()
  })

  it('shows prices to a signed-in user when the pricing page requires login', () => {
    renderModels({
      isAuthenticated: true,
      headerNavModules: { pricing: { enabled: true, requireAuth: true } },
    })

    expect(screen.getByText('gpt-5-mini')).toBeInTheDocument()
    expect(
      screen.queryByText('Sign in to see the full price list.')
    ).not.toBeInTheDocument()
  })
})
