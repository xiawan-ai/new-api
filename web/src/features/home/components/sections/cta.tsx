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
    // Continue the paper/cream rhythm after the FAQ's cream background.
    <section className='bg-paper text-foreground relative z-10 border-t'>
      <div className='finch-container finch-section flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between'>
        <AnimateInView className='max-w-2xl'>
          <h2 className='text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.15] font-semibold tracking-[-0.02em]'>
            {t('Ready to make')}
            <br />
            <em className='text-muted-foreground not-italic'>
              {t('your first request?')}
            </em>
          </h2>
          <p className='text-muted-foreground mt-5 max-w-xl text-[17px] leading-[1.75]'>
            {t(
              'Create an account, add credit and copy your key. It takes a few minutes.'
            )}
          </p>
        </AnimateInView>

        <AnimateInView
          delay={120}
          className='flex flex-wrap items-center gap-x-6 gap-y-2'
        >
          <Button
            className='group h-12 rounded-lg px-7 text-[15px] font-semibold'
            render={<Link to='/sign-up' />}
          >
            {t('Get your API key')}
            <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
          <Link
            to='/pricing'
            className='text-muted-foreground decoration-foreground/30 hover:text-foreground focus-visible:outline-foreground inline-flex min-h-11 items-center rounded-sm text-[15px] underline underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2'
          >
            {t('See models and prices')}
          </Link>
        </AnimateInView>
      </div>
    </section>
  )
}
