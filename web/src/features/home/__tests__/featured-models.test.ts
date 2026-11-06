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
import { describe, expect, it } from 'vitest'

import type { PricingModel } from '@/features/pricing/types'

import {
  FEATURED_MODEL_LIMIT,
  selectFeaturedModels,
} from '../lib/featured-models'

function model(
  name: string,
  vendor: string | undefined,
  overrides: Partial<PricingModel> = {}
): PricingModel {
  return {
    id: name.length,
    model_name: name,
    vendor_name: vendor,
    quota_type: 0,
    model_ratio: 1,
    completion_ratio: 1,
    enable_groups: ['default'],
    ...overrides,
  }
}

describe('selectFeaturedModels', () => {
  it('keeps catalog order and at most two models per vendor', () => {
    const picked = selectFeaturedModels([
      model('a-1', 'Acme'),
      model('a-2', 'Acme'),
      model('a-3', 'Acme'),
      model('b-1', 'Beta'),
    ])

    expect(picked.map((m) => m.model_name)).toEqual(['a-1', 'a-2', 'b-1'])
  })

  it('skips per-request and dynamically priced models', () => {
    const picked = selectFeaturedModels([
      model('per-request', 'Acme', { quota_type: 1 }),
      model('tiered', 'Acme', {
        billing_mode: 'tiered_expr',
        billing_expr: 'input_tokens * 2',
      }),
      model('flat', 'Acme'),
    ])

    expect(picked.map((m) => m.model_name)).toEqual(['flat'])
  })

  it('treats models without a vendor as one group and stops at the limit', () => {
    const noVendor = Array.from({ length: 4 }, (_, i) =>
      model(`nv-${i}`, undefined)
    )
    const vendors = Array.from({ length: 12 }, (_, i) =>
      model(`v-${i}`, `Vendor ${i}`)
    )

    const picked = selectFeaturedModels([...noVendor, ...vendors])

    expect(picked).toHaveLength(FEATURED_MODEL_LIMIT)
    expect(picked.filter((m) => !m.vendor_name)).toHaveLength(2)
  })

  it('returns an empty list for an empty catalog', () => {
    expect(selectFeaturedModels([])).toEqual([])
  })
})
