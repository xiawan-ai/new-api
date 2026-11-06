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
import { KeyRound, Plug, UserRoundPlus } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

export function HowItWorks() {
  const { t } = useTranslation()

  const steps = [
    {
      num: '1',
      title: t('Create an account'),
      desc: t('Sign up with your email. It takes about a minute.'),
      icon: <UserRoundPlus className='size-5' strokeWidth={1.5} />,
    },
    {
      num: '2',
      title: t('Add credit and create a key'),
      desc: t(
        'Top up any amount you like, then create an API key in the console.'
      ),
      icon: <KeyRound className='size-5' strokeWidth={1.5} />,
    },
    {
      num: '3',
      title: t('Point your app at the base URL'),
      desc: t(
        'Paste the base URL and your key into Finch Agent or your own code. Then send your first request.'
      ),
      icon: <Plug className='size-5' strokeWidth={1.5} />,
    },
  ]

  return (
    <section
      id='how-it-works'
      className='bg-paper finch-section relative z-10 border-t'
    >
      <div className='finch-container'>
        <AnimateInView className='max-w-2xl'>
          <p className='finch-eyebrow'>{t('How It Works')}</p>
          <h2 className='mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Three steps to your first request')}
          </h2>
        </AnimateInView>

        <ol className='mt-12 grid gap-x-12 gap-y-10 md:mt-16 md:grid-cols-3'>
          {steps.map((step, i) => (
            <AnimateInView
              key={step.num}
              as='li'
              delay={i * 120}
              animation='fade-up'
              className='border-foreground/20 border-t pt-6'
            >
              <div className='flex items-start justify-between'>
                <span
                  className='font-display text-brand text-5xl leading-none font-semibold tabular-nums'
                  aria-hidden='true'
                >
                  {step.num}
                </span>
                <span className='text-muted-foreground' aria-hidden='true'>
                  {step.icon}
                </span>
              </div>
              <h3 className='mt-6 text-2xl leading-[1.25] font-semibold tracking-[-0.015em]'>
                {step.title}
              </h3>
              <p className='text-muted-foreground mt-3 text-base leading-[1.75]'>
                {step.desc}
              </p>
            </AnimateInView>
          ))}
        </ol>
      </div>
    </section>
  )
}
