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
import { ArrowUpRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

const APP_ROW_CLASS =
  'group hover:text-primary flex min-h-16 items-center gap-4 text-[17px] font-medium transition-colors'

export function Apps() {
  const { t } = useTranslation()

  return (
    <section id='apps' className='finch-section relative z-10'>
      <div className='finch-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16'>
        <AnimateInView className='lg:col-span-5'>
          <p className='finch-eyebrow'>{t('Supported Applications')}</p>
          <h2 className='mt-4 text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Paste your key into the apps you already use')}
          </h2>
          <p className='text-muted-foreground mt-5 max-w-md text-base leading-[1.75]'>
            {t(
              'These apps take a base URL and a key. Enter both once, then pick any model from the list.'
            )}
          </p>
        </AnimateInView>

        <AnimateInView delay={100} className='lg:col-span-7'>
          <ul className='border-foreground/10 border-t'>
            <li className='border-foreground/10 border-b'>
              <a
                href='https://finchwork.app'
                target='_blank'
                rel='noopener noreferrer'
                className={APP_ROW_CLASS}
              >
                <img src='/finch-mark.svg' alt='' className='size-7 shrink-0' />
                <span>Finch Agent</span>
                <ArrowUpRight
                  className='text-muted-foreground group-hover:text-primary ml-auto size-4 transition-colors'
                  aria-hidden='true'
                />
              </a>
            </li>

            <li className='border-foreground/10 text-muted-foreground flex min-h-16 items-center gap-4 border-b text-[15px]'>
              <span
                className='flex size-7 shrink-0 items-center justify-center'
                aria-hidden='true'
              >
                <svg viewBox='0 0 24 24' className='size-6' fill='currentColor'>
                  <circle cx='6' cy='12' r='2' />
                  <circle cx='12' cy='12' r='2' />
                  <circle cx='18' cy='12' r='2' />
                </svg>
              </span>
              <span>
                {t('Any app or SDK that accepts a custom OpenAI base URL')}
              </span>
            </li>
          </ul>
        </AnimateInView>
      </div>
    </section>
  )
}
