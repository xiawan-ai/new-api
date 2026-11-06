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
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { Skeleton } from '@/components/ui/skeleton'
import { usePricingData } from '@/features/pricing/hooks/use-pricing-data'
import { formatPrice } from '@/features/pricing/lib/price'
import { useStatus } from '@/hooks/use-status'
import { getLobeIcon } from '@/lib/lobe-icon'
import { getModuleAccessFromStatus } from '@/lib/nav-modules'

import { FEATURED_MODEL_LIMIT, selectFeaturedModels } from '../../lib/featured-models'

interface ModelsProps {
  isAuthenticated?: boolean
}

const SECTION_LINK_CLASS =
  'group text-primary hover:text-brand focus-visible:outline-ring inline-flex min-h-11 items-center gap-1.5 rounded-sm text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

export function Models(props: ModelsProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const access = getModuleAccessFromStatus(status, 'pricing')
  const signInRequired = access.requireAuth && !props.isAuthenticated
  const canLoad = access.enabled && !signInRequired
  const { models, isLoading, error, priceRate, usdExchangeRate } =
    usePricingData(canLoad)
  const featured = useMemo(() => selectFeaturedModels(models), [models])

  if (!access.enabled) return null

  let body: React.ReactNode
  if (signInRequired) {
    body = (
      <p className='text-muted-foreground mt-10 max-w-xl text-base leading-[1.75]'>
        {t('Sign in to see the full price list.')}{' '}
        <Link to='/sign-in' className='text-primary underline underline-offset-4'>
          {t('Sign in')}
        </Link>
      </p>
    )
  } else if (isLoading) {
    body = (
      <ul className='border-foreground/10 mt-10 border-t' aria-busy='true'>
        {Array.from({ length: 4 }, (_, i) => (
          <li
            key={i}
            className='border-foreground/10 flex items-center gap-4 border-b py-5'
          >
            <Skeleton className='size-7 rounded-md' />
            <Skeleton className='h-4 w-48' />
            <Skeleton className='ml-auto h-4 w-20' />
            <Skeleton className='h-4 w-20' />
          </li>
        ))}
      </ul>
    )
  } else if (error || featured.length === 0) {
    body = null
  } else {
    body = (
      <ul className='border-foreground/10 mt-10 border-t'>
        {featured.map((model, i) => {
          const icon = getLobeIcon(model.icon || model.vendor_icon, 28)
          return (
            <AnimateInView
              key={model.model_name}
              as='li'
              delay={i * 50}
              className='border-foreground/10 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-4 gap-y-1 border-b py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:gap-x-8'
            >
              <span
                className='bg-brand/8 text-brand flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-semibold'
                aria-hidden='true'
              >
                {icon ?? model.model_name.charAt(0).toUpperCase()}
              </span>
              <span className='min-w-0'>
                <span className='block truncate text-[15px] font-semibold'>
                  {model.model_name}
                </span>
                {model.vendor_name && (
                  <span className='text-muted-foreground block truncate text-sm'>
                    {model.vendor_name}
                  </span>
                )}
              </span>
              <ModelPrice
                label={t('Input')}
                value={formatPrice(
                  model,
                  'input',
                  'M',
                  false,
                  priceRate,
                  usdExchangeRate
                )}
              />
              <ModelPrice
                label={t('Output')}
                value={formatPrice(
                  model,
                  'output',
                  'M',
                  false,
                  priceRate,
                  usdExchangeRate
                )}
              />
            </AnimateInView>
          )
        })}
      </ul>
    )
  }

  return (
    <section id='models' className='finch-section relative z-10'>
      <div className='finch-container'>
        <AnimateInView className='flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
          <div className='max-w-2xl'>
            <p className='finch-eyebrow'>{t('Models and prices')}</p>
            <h2 className='mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
              {t('Priced per million tokens')}
            </h2>
            <p className='text-muted-foreground mt-4 max-w-xl text-base leading-[1.75]'>
              {t(
                'Every model is billed by tokens at the price listed. Your balance updates after each request.'
              )}
            </p>
          </div>
          <Link to='/pricing' className={SECTION_LINK_CLASS}>
            {t('See all models')}
            <ArrowRight className='size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </AnimateInView>

        {body}

        {featured.length >= FEATURED_MODEL_LIMIT && (
          <p className='text-muted-foreground mt-6 text-sm'>
            {t('Showing a selection. The full list is on the models page.')}
          </p>
        )}
      </div>
    </section>
  )
}

function ModelPrice(props: { label: string; value: string }) {
  return (
    <span className='col-start-2 flex items-baseline gap-2 sm:col-start-auto sm:block sm:text-right'>
      <span className='text-muted-foreground text-xs font-semibold tracking-[0.08em] uppercase sm:block'>
        {props.label}
      </span>
      <span className='font-mono text-[15px] tabular-nums'>
        {props.value}
        <span className='text-muted-foreground text-xs'> / 1M</span>
      </span>
    </span>
  )
}
