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
import { isDynamicPricingModel } from '@/features/pricing/lib/dynamic-price'
import { isTokenBasedModel } from '@/features/pricing/lib/model-helpers'
import type { PricingModel } from '@/features/pricing/types'

export const FEATURED_MODEL_LIMIT = 8
export const FEATURED_MODELS_PER_VENDOR = 2

/**
 * The short price list on the home page: token-billed models with a flat
 * price, at most two per vendor, in catalog order. Breadth across vendors
 * tells a buyer more than eight models from one.
 */
export function selectFeaturedModels(models: PricingModel[]): PricingModel[] {
  const perVendor = new Map<string, number>()
  const featured: PricingModel[] = []

  for (const model of models) {
    if (featured.length >= FEATURED_MODEL_LIMIT) break
    if (!isTokenBasedModel(model) || isDynamicPricingModel(model)) continue

    const vendor = model.vendor_name?.trim() || ''
    const taken = perVendor.get(vendor) ?? 0
    if (taken >= FEATURED_MODELS_PER_VENDOR) continue

    perVendor.set(vendor, taken + 1)
    featured.push(model)
  }

  return featured
}
