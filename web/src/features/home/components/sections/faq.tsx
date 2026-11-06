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
import { Trans, useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { useSystemConfig } from '@/hooks/use-system-config'

import { useApiBaseUrl } from '../../hooks'

export function Faq() {
  const { t } = useTranslation()
  const baseUrl = useApiBaseUrl()
  const { systemName } = useSystemConfig()

  const items = [
    {
      id: 'billing',
      question: t('How am I charged?'),
      answer: t(
        'Pay as you go. Each request costs the tokens it used at the price listed for that model. Your balance updates in the console after every request.'
      ),
    },
    {
      id: 'subscription',
      question: t('Do I need a subscription?'),
      answer: (
        <Trans
          t={t}
          i18nKey='No. Top up {{siteName}} when you need it. There are no monthly fees. For bigger discounts, sign up in <agent>Finch Agent</agent> and subscribe to a monthly plan.'
          values={{ siteName: systemName }}
          components={{
            agent: (
              <a
                href='https://finchwork.app'
                target='_blank'
                rel='noopener noreferrer'
                className='text-primary hover:text-brand underline underline-offset-4 transition-colors'
              />
            ),
          }}
        />
      ),
    },
    {
      id: 'models',
      question: t('Which models can I use?'),
      answer: t(
        'Every model on the models and prices page. One key works for all of them.'
      ),
    },
    {
      id: 'sdk',
      question: t('Does my key work with the OpenAI SDK?'),
      answer: t(
        'Yes. Set the base URL to {{baseUrl}} and use your key as the API key. The Claude and Gemini request formats are supported too.',
        { baseUrl }
      ),
    },
    {
      id: 'usage',
      question: t('Can I see what I spent?'),
      answer: t(
        'Yes. The console lists every request with its model, token count and cost.'
      ),
    },
  ]

  return (
    <section id='faq' className='finch-section relative z-10 border-t'>
      <div className='finch-container grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16'>
        <AnimateInView className='lg:col-span-4'>
          <p className='finch-eyebrow'>{t('Questions')}</p>
          <h2 className='mt-4 text-[clamp(1.875rem,3.6vw,2.75rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Before you buy')}
          </h2>
        </AnimateInView>

        <AnimateInView delay={100} className='lg:col-span-8'>
          <Accordion className='border-foreground/10 border-t'>
            {items.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className='border-foreground/10 border-b'
              >
                <AccordionTrigger className='py-5 text-[17px] font-semibold tracking-[-0.01em] hover:no-underline'>
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className='text-muted-foreground max-w-2xl pb-6 text-base leading-[1.75]'>
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </AnimateInView>
      </div>
    </section>
  )
}
