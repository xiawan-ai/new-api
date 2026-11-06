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

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    // The one dark section on the page: deep brand ground, paper-colored type.
    <section className='bg-primary text-primary-foreground relative z-10'>
      <div className='finch-container finch-section flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between'>
        <AnimateInView className='max-w-2xl'>
          <h2 className='text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Ready to simplify')}
            <br />
            <em className='text-brand-soft not-italic'>
              {t('your AI integration?')}
            </em>
          </h2>
          <p className='text-primary-foreground/75 mt-5 max-w-xl text-[17px] leading-[1.75]'>
            {t(
              'Deploy your own gateway and start routing requests through your configured upstream services.'
            )}
          </p>
        </AnimateInView>

        <AnimateInView
          delay={120}
          className='flex flex-wrap items-center gap-x-6 gap-y-2'
        >
          <Button
            className='group bg-background text-primary [a]:hover:bg-background/90 h-12 rounded-lg px-7 text-[15px] font-semibold'
            render={<Link to='/sign-up' />}
          >
            {t('Get Started')}
            <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Link
            to='/pricing'
            className='text-primary-foreground/80 decoration-primary-foreground/40 hover:text-primary-foreground focus-visible:outline-primary-foreground inline-flex min-h-11 items-center rounded-sm text-[15px] underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            {t('View Pricing')}
          </Link>
        </AnimateInView>
      </div>
    </section>
  )
}
