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
import { Gauge, DollarSign, Users, HeartHandshake } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  // `meta` is the short factual line under a feature: the concrete things it
  // covers, set quietly instead of as decorative mock UI.
  const features = [
    {
      id: 'fast',
      num: '01',
      title: t('Lightning Fast'),
      desc: t(
        'Optimized network architecture ensures millisecond response times'
      ),
      meta: ['OpenAI', 'Claude', 'Gemini', 'DeepSeek', 'Qwen', 'Llama'],
    },
    {
      id: 'secure',
      num: '02',
      title: t('Secure & Reliable'),
      desc: t(
        'Enterprise-grade security with comprehensive permission management'
      ),
      meta: [],
    },
    {
      id: 'global',
      num: '03',
      title: t('Global Coverage'),
      desc: t('Multi-region deployment for stable global access'),
      meta: [t('Load Balancing'), t('Rate Limiting'), t('Cost Tracking')],
    },
    {
      id: 'developer',
      num: '04',
      title: t('Developer Friendly'),
      desc: t('Compatible API routes for common AI application workflows'),
      meta: ['API', 'SDK', 'CLI', 'Docs', t('Multi-protocol Compatible')],
    },
  ]

  const additionalFeatures = [
    {
      icon: <Gauge className='size-5' strokeWidth={1.5} aria-hidden='true' />,
      title: t('High Performance'),
      desc: t('Support for high concurrency with automatic load balancing'),
    },
    {
      icon: (
        <DollarSign className='size-5' strokeWidth={1.5} aria-hidden='true' />
      ),
      title: t('Transparent Billing'),
      desc: t('Pay-as-you-go with real-time usage monitoring'),
    },
    {
      icon: <Users className='size-5' strokeWidth={1.5} aria-hidden='true' />,
      title: t('Team Collaboration'),
      desc: t('Multi-user management with flexible permission allocation'),
    },
    {
      icon: (
        <HeartHandshake
          className='size-5'
          strokeWidth={1.5}
          aria-hidden='true'
        />
      ),
      title: t('Open Source'),
      desc: t('Community driven, self-hosted, and extensible'),
    },
  ]

  return (
    <section id='features' className='finch-section relative z-10'>
      <div className='finch-container'>
        <AnimateInView className='max-w-2xl'>
          <p className='finch-eyebrow'>{t('Core Features')}</p>
          <h2 className='mt-4 text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Built for developers,')}
            <br />
            {t('designed for scale')}
          </h2>
        </AnimateInView>

        {/* Ruled two-column list: whitespace and hairlines, no card stack */}
        <div className='mt-12 grid border-t md:mt-16 md:grid-cols-2'>
          {features.map((f, i) => (
            <AnimateInView
              key={f.id}
              delay={i * 80}
              className='flex gap-5 border-b py-9 md:py-11 md:odd:pr-12 md:even:border-l md:even:pl-12'
            >
              <span className='font-display text-brand-accent-ink pt-1.5 text-sm font-semibold tabular-nums'>
                {f.num}
              </span>
              <div className='min-w-0'>
                <h3 className='text-[clamp(1.5rem,2.6vw,1.875rem)] leading-[1.25] font-semibold tracking-[-0.015em]'>
                  {f.title}
                </h3>
                <p className='text-muted-foreground mt-3 text-base leading-[1.75]'>
                  {f.desc}
                </p>
                {f.meta.length > 0 && (
                  <p className='text-foreground/70 mt-4 text-[13px] leading-[1.7] font-medium'>
                    {f.meta.join(' · ')}
                  </p>
                )}
              </div>
            </AnimateInView>
          ))}
        </div>

        {/* Additional features row */}
        <div className='mt-14 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-4'>
          {additionalFeatures.map((f, i) => (
            <AnimateInView key={f.title} delay={i * 80} animation='fade-up'>
              <div className='text-brand'>{f.icon}</div>
              <h3 className='mt-4 font-sans text-base font-semibold tracking-normal'>
                {f.title}
              </h3>
              <p className='text-muted-foreground mt-2 text-sm leading-[1.7]'>
                {f.desc}
              </p>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
