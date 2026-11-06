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
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { THEME_STORAGE_KEYS } from '@/lib/theme-storage'

// The inline script in index.html must apply the theme class before React
// mounts; Dark Reader checks `html.dark` only once while the page loads.
const html = readFileSync(
  resolve(import.meta.dirname, '../../../index.html'),
  'utf8'
)
const bootScript = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? ''

function runBootScript() {
  new Function(bootScript)()
}

function mockSystemDarkMode(dark: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        matches: dark && query === '(prefers-color-scheme: dark)',
        media: query,
      }) as MediaQueryList
  )
}

beforeEach(() => {
  localStorage.clear()
})

afterEach(() => {
  vi.restoreAllMocks()
  localStorage.clear()
  document.documentElement.classList.remove('light', 'dark')
})

describe('index.html theme boot script', () => {
  // The mode is locked to light (LOCKED_THEME_MODE): the cream paper theme has
  // no dark counterpart, so the script must not follow saved or system dark.
  it.each(['dark', 'light', 'system', 'sepia'])(
    'applies light before React mounts when the saved preference is %j',
    (saved) => {
      mockSystemDarkMode(true)
      localStorage.setItem(THEME_STORAGE_KEYS.mode, saved)

      runBootScript()

      expect(document.documentElement).toHaveClass('light')
      expect(document.documentElement).not.toHaveClass('dark')
    }
  )

  it('applies light when the system prefers dark and no preference is saved', () => {
    mockSystemDarkMode(true)

    runBootScript()

    expect(document.documentElement).toHaveClass('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('leaves the saved preference untouched for a later unlock', () => {
    mockSystemDarkMode(false)
    localStorage.setItem(THEME_STORAGE_KEYS.mode, 'dark')

    runBootScript()

    expect(localStorage.getItem(THEME_STORAGE_KEYS.mode)).toBe('dark')
  })
})
