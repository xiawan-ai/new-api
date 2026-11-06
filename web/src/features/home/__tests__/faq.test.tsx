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
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { STATUS_QUERY_KEY } from '@/lib/status-query'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { Faq } from '../components/sections/faq'

const initialConfig = useSystemConfigStore.getState().config

function renderFaq() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  client.setQueryData(STATUS_QUERY_KEY, {})
  render(
    <QueryClientProvider client={client}>
      <Faq />
    </QueryClientProvider>
  )
}

afterEach(() => {
  useSystemConfigStore.setState({ config: initialConfig })
})

describe('home FAQ', () => {
  it('answers the subscription question with the site name and a link to Finch Agent', async () => {
    useSystemConfigStore.setState({
      config: { ...initialConfig, systemName: 'Finch API' },
    })
    renderFaq()

    fireEvent.click(
      screen.getByRole('button', { name: 'Do I need a subscription?' })
    )

    const link = await screen.findByRole('link', { name: 'Finch Agent' })
    expect(link).toHaveAttribute('href', 'https://finchwork.app')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link.parentElement).toHaveTextContent(
      'Top up Finch API when you need it.'
    )
  })
})
