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
import { useTranslation } from 'react-i18next'

import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'

import { useApiBaseUrl } from '../../hooks'
import { AsciiBackground } from '../ascii-background'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

// One primary action per view; everything else in the hero is a text link.
const PRIMARY_CTA_CLASS =
  'group [a]:hover:bg-brand h-12 rounded-lg px-7 text-[15px] font-semibold shadow-[0_10px_24px_rgba(34,57,47,0.14)]'
const TEXT_LINK_CLASS =
  'text-foreground/70 decoration-foreground/30 hover:text-primary focus-visible:outline-ring inline-flex min-h-11 items-center rounded-sm text-[15px] underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const baseUrl = useApiBaseUrl()

  return (
    <section
      id='hero'
      className='finch-paper-texture relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24'
    >
      <AsciiBackground />

      <div className='finch-container relative flex flex-col items-start'>
        <p
          className='landing-animate-fade-up text-primary/80 text-sm font-semibold tracking-[0.01em] opacity-0 sm:text-[15px]'
          style={{ animationDelay: '0ms' }}
        >
          {t('Pay-as-you-go API keys')}
        </p>

        <h1
          className='landing-animate-fade-up mt-4 text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.14] font-semibold tracking-[-0.03em] text-balance opacity-0'
          style={{ animationDelay: '60ms' }}
        >
          <span className='block'>{t('One API key.')}</span>
          <em className='text-brand block not-italic'>
            {t('Every major AI model.')}
          </em>
        </h1>

        <p
          className='landing-animate-fade-up text-foreground/75 mt-5 max-w-[620px] text-[17px] leading-[1.75] opacity-0 sm:text-[19px]'
          style={{ animationDelay: '120ms' }}
        >
          {t(
            'Point your app at our base URL and call OpenAI, Claude, Gemini and more with one key. No subscription and no minimum. You pay only for the tokens you use.'
          )}
        </p>

        <div
          className='landing-animate-fade-up mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 opacity-0'
          style={{ animationDelay: '180ms' }}
        >
          {props.isAuthenticated ? (
            <Button
              className={PRIMARY_CTA_CLASS}
              render={<Link to='/dashboard' />}
            >
              {t('Go to Dashboard')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          ) : (
            <Button className={PRIMARY_CTA_CLASS} render={<Link to='/sign-up' />}>
              {t('Get your API key')}
              <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
          )}
          <Link to='/pricing' className={TEXT_LINK_CLASS}>
            {t('See models and prices')}
          </Link>
        </div>

        {/* The one fact a buyer needs before anything else: where to point
            their client. */}
        <div
          className='landing-animate-fade-up border-foreground/10 bg-card/70 mt-12 flex max-w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border py-2 pr-1.5 pl-4 opacity-0 backdrop-blur-sm'
          style={{ animationDelay: '260ms' }}
        >
          <span className='finch-eyebrow'>{t('Base URL')}</span>
          <code
            data-testid='hero-base-url'
            className='text-foreground min-w-0 truncate font-mono text-[14px] sm:text-[15px]'
          >
            {baseUrl}
          </code>
          <CopyButton
            value={baseUrl}
            size='sm'
            className='h-9 rounded-lg px-2.5'
            aria-label={t('Copy base URL')}
          />
        </div>
      </div>
    </section>
  )
}
