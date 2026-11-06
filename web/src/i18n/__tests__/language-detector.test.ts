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
import { afterEach, describe, expect, test } from 'vitest'

import { languageDetector } from '../language-detector'

afterEach(() => {
  localStorage.clear()
})

describe('interface language detection', () => {
  test('starts a first-time visitor in Simplified Chinese whatever the browser language', () => {
    // jsdom reports an English browser; it must not decide the language.
    expect(navigator.language.startsWith('en')).toBe(true)

    expect(languageDetector.detect()).toBe('zhCN')
  })

  test.each(['en', 'zhTW', 'ja'])(
    'keeps the language a visitor chose earlier (%s)',
    (chosen) => {
      localStorage.setItem('i18nextLng', chosen)

      expect(languageDetector.detect()).toBe(chosen)
    }
  )
})
