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
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { CopyButton } from '@/components/copy-button'

import { useApiBaseUrl } from '../../hooks'
import { HeroTerminalDemo } from '../hero-terminal-demo'

// Request formats a buyer's existing client may already speak.
const PROTOCOLS = [
  { label: 'OpenAI', paths: ['/v1/chat/completions', '/v1/responses'] },
  { label: 'Claude', paths: ['/v1/messages'] },
  { label: 'Gemini', paths: ['/v1beta/models/{model}:generateContent'] },
]

export function ApiDemo() {
  const { t } = useTranslation()
  const baseUrl = useApiBaseUrl()

  return (
    <section id='api' className='bg-paper finch-section relative z-10 border-y'>
      <div className='finch-container grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16'>
        <AnimateInView className='lg:col-span-5'>
          <p className='finch-eyebrow'>{t('Works with your existing code')}</p>
          <h2 className='mt-4 text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Change the base URL.')}
            <br />
            {t('Keep everything else.')}
          </h2>
          <p className='text-muted-foreground mt-5 text-base leading-[1.75]'>
            {t(
              'Your key accepts the OpenAI, Claude and Gemini request formats, so most SDKs and apps connect without code changes.'
            )}
          </p>

          <div className='border-foreground/10 mt-8 border-t'>
            <div className='border-foreground/10 flex items-center gap-3 border-b py-4'>
              <span className='text-muted-foreground w-20 shrink-0 text-xs font-semibold tracking-[0.08em] uppercase'>
                {t('Base URL')}
              </span>
              <code className='min-w-0 flex-1 truncate font-mono text-[14px]'>
                {baseUrl}
              </code>
              <CopyButton
                value={baseUrl}
                size='sm'
                className='h-8 rounded-md px-2'
                aria-label={t('Copy base URL')}
              />
            </div>
            {PROTOCOLS.map((protocol) => (
              <div
                key={protocol.label}
                className='border-foreground/10 flex items-start gap-3 border-b py-4'
              >
                <span className='text-muted-foreground w-20 shrink-0 pt-0.5 text-xs font-semibold tracking-[0.08em] uppercase'>
                  {protocol.label}
                </span>
                <span className='flex min-w-0 flex-col gap-1'>
                  {protocol.paths.map((path) => (
                    <code
                      key={path}
                      className='truncate font-mono text-[13.5px]'
                    >
                      {path}
                    </code>
                  ))}
                </span>
              </div>
            ))}
          </div>
        </AnimateInView>

        <AnimateInView delay={120} className='min-w-0 lg:col-span-7'>
          <HeroTerminalDemo baseUrl={baseUrl} className='mx-0 max-w-none' />
        </AnimateInView>
      </div>
    </section>
  )
}
