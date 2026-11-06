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
import { CherryStudio } from '@lobehub/icons'
import { Link } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'

import { AsciiBackground } from '../ascii-background'
import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

// One primary action per view; everything else in the hero is a text link.
const PRIMARY_CTA_CLASS =
  'group [a]:hover:bg-brand h-12 rounded-lg px-7 text-[15px] font-semibold shadow-[0_10px_24px_rgba(34,57,47,0.14)]'
const TEXT_LINK_CLASS =
  'text-foreground/70 decoration-foreground/30 hover:text-primary focus-visible:outline-ring inline-flex min-h-11 items-center rounded-sm text-[15px] underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
const APP_ROW_CLASS = 'flex min-h-14 items-center gap-3 text-[15px] font-medium'

// Stylized three-dots indicator representing "More"
const MoreIcon = () => (
  <svg
    className='text-muted-foreground size-6 shrink-0'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
  >
    <circle cx='6' cy='12' r='2' fill='currentColor' />
    <circle cx='12' cy='12' r='2' fill='currentColor' />
    <circle cx='18' cy='12' r='2' fill='currentColor' />
  </svg>
)

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const docsUrl =
    (status?.docs_link as string | undefined) || 'https://docs.newapi.pro'

  const renderDocsLink = () => {
    if (docsUrl.startsWith('http')) {
      return (
        <a
          href={docsUrl}
          target='_blank'
          rel='noopener noreferrer'
          className={TEXT_LINK_CLASS}
        >
          {t('Docs')}
        </a>
      )
    }
    return (
      <Link to={docsUrl} className={TEXT_LINK_CLASS}>
        {t('Docs')}
      </Link>
    )
  }

  return (
    <section
      id='hero'
      className='finch-paper-texture relative z-10 overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24'
    >
      <AsciiBackground />

      <div className='finch-container relative flex flex-col gap-14 md:gap-16'>
        {/* Statement: what this is, the headline, one primary action */}
        <div className='flex flex-col items-start'>
          <p
            className='landing-animate-fade-up text-primary/80 text-sm font-semibold tracking-[0.01em] opacity-0 sm:text-[15px]'
            style={{ animationDelay: '0ms' }}
          >
            {t('AI Application Infrastructure Foundation')}
          </p>

          <h1
            className='landing-animate-fade-up mt-4 text-[clamp(2.5rem,5.2vw,4.25rem)] leading-[1.14] font-semibold tracking-[-0.03em] text-balance opacity-0'
            style={{ animationDelay: '60ms' }}
          >
            <span className='block'>{t('Unified API Gateway for')}</span>
            <em className='text-brand block not-italic'>
              {t('Vast Range of AI Models')}
            </em>
          </h1>

          <p
            className='landing-animate-fade-up text-foreground/75 mt-5 max-w-[600px] text-[17px] leading-[1.75] opacity-0 sm:text-[19px]'
            style={{ animationDelay: '120ms' }}
          >
            {t(
              'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
            )}
          </p>

          <div
            className='landing-animate-fade-up mt-10 flex flex-wrap items-center gap-x-5 gap-y-2 opacity-0'
            style={{ animationDelay: '180ms' }}
          >
            {props.isAuthenticated ? (
              <>
                <Button
                  className={PRIMARY_CTA_CLASS}
                  render={<Link to='/dashboard' />}
                >
                  {t('Go to Dashboard')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                {renderDocsLink()}
              </>
            ) : (
              <>
                <Button
                  className={PRIMARY_CTA_CLASS}
                  render={<Link to='/sign-up' />}
                >
                  {t('Get Started')}
                  <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Link to='/pricing' className={TEXT_LINK_CLASS}>
                  {t('View Pricing')}
                </Link>
                {renderDocsLink()}
              </>
            )}
          </div>
        </div>

        {/* Product proof: the API demo, with supported apps as a side note */}
        <div
          className='landing-animate-fade-up grid grid-cols-1 items-start gap-10 opacity-0 lg:grid-cols-12 lg:gap-12'
          style={{ animationDelay: '260ms' }}
        >
          <HeroTerminalDemo className='mx-0 lg:col-span-7' />

          <aside className='lg:col-span-5' aria-labelledby='hero-apps-title'>
            <p id='hero-apps-title' className='finch-eyebrow'>
              {t('Supported Applications')}
            </p>
            <p className='text-muted-foreground mt-3 max-w-sm text-sm leading-[1.7]'>
              {t(
                'Supports one-click configuration and perfectly adapts to NewAPI multi-protocol configuration.'
              )}
            </p>

            <ul className='border-foreground/10 mt-6 border-t'>
              <li className='border-foreground/10 border-b'>
                <a
                  href='https://cherry-ai.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`group hover:text-primary transition-colors ${APP_ROW_CLASS}`}
                >
                  <CherryStudio.Color size={24} className='shrink-0' />
                  <span>Cherry Studio</span>
                  <ArrowUpRight
                    className='text-muted-foreground group-hover:text-primary ml-auto size-4 transition-colors'
                    aria-hidden='true'
                  />
                </a>
              </li>

              <li className='border-foreground/10 border-b'>
                <a
                  href='https://ccswitch.io'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={`group hover:text-primary transition-colors ${APP_ROW_CLASS}`}
                >
                  <img
                    src='https://ccswitch.io/favicon.png'
                    alt=''
                    className='size-6 shrink-0 rounded-md object-contain'
                    onError={(e) => {
                      // Fallback to a styled text avatar if the remote favicon fails to load in sandbox or local environments
                      e.currentTarget.style.display = 'none'
                      const fallback = e.currentTarget
                        .nextSibling as HTMLElement
                      if (fallback) fallback.style.display = 'flex'
                    }}
                  />
                  <span
                    style={{ display: 'none' }}
                    className='bg-brand/10 text-brand size-6 shrink-0 items-center justify-center rounded-md text-[10px] font-bold'
                    aria-hidden='true'
                  >
                    CC
                  </span>
                  <span>CC Switch</span>
                  <ArrowUpRight
                    className='text-muted-foreground group-hover:text-primary ml-auto size-4 transition-colors'
                    aria-hidden='true'
                  />
                </a>
              </li>

              <li
                className={`border-foreground/10 text-muted-foreground border-b ${APP_ROW_CLASS}`}
              >
                <MoreIcon />
                <span>{t('More Apps')}</span>
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </section>
  )
}
