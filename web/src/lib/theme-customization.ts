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
/**
 * Theme customization constants and types.
 *
 * Lives in `lib/` (not `context/`) so it can be imported alongside the
 * provider without breaking React Fast Refresh boundaries.
 */

/**
 * Color presets.
 *
 * This deployment ships one look, the Finch house style in styles/finch.css,
 * so `default` is the only preset and the picker in the theme drawer hides
 * itself. The preset axis (storage key, `data-theme-preset`, provider API) is
 * kept so a preset can be added back by listing it here and giving it a
 * `[data-theme-preset='…']` block in styles/theme-presets.css. A preset value
 * saved by an older build is no longer in this list and falls back to
 * `default`.
 */
export const THEME_PRESETS = [
  {
    // Swatches preview paper → brand.
    value: 'default',
    name: 'Default',
    swatches: ['#f4f1e8', '#3f6b56'],
  },
] as const

/**
 * Light/dark mode lock.
 *
 * The Finch house style is one cream paper theme (styles/finch.css) with no
 * dark counterpart, so the mode axis is pinned to light: stored and system
 * preferences are ignored and the mode controls hide themselves. Set this to
 * `null` to give users the System / Light / Dark choice back, and restore the
 * preference lookup in the index.html boot script at the same time.
 */
export const LOCKED_THEME_MODE: 'light' | 'dark' | null = 'light'

export type ThemePreset = (typeof THEME_PRESETS)[number]['value']
export type ThemeRadius = 'default' | 'none' | 'sm' | 'md' | 'lg' | 'xl'
export type ThemeScale = 'default' | 'sm' | 'lg' | 'xl'
export type ContentLayout = 'full' | 'centered'

/**
 * Font axis for the theme.
 *
 * - `default` — the house typography: system sans body with serif headlines
 *   (a preset may specify its own body font through `PRESET_DEFAULT_FONT`).
 * - `sans` — explicitly use Public Sans.
 * - `serif` — use Lora + CJK fallbacks. Monospace contexts keep their
 *   own family via Tailwind preflight and `.font-mono`.
 */
export type ThemeFont = 'default' | 'sans' | 'serif'

/**
 * The resolved (non-`default`) font value applied to the DOM. The provider
 * always sets `data-theme-font` to one of these concrete values so CSS only
 * needs simple attribute selectors (no `:not()` gymnastics, no per-preset
 * font branches).
 */
export type ResolvedThemeFont = 'system' | Exclude<ThemeFont, 'default'>

export type ThemeCustomization = {
  preset: ThemePreset
  font: ThemeFont
  radius: ThemeRadius
  scale: ThemeScale
  contentLayout: ContentLayout
}

export const DEFAULT_THEME_CUSTOMIZATION: ThemeCustomization = {
  preset: 'default',
  font: 'default',
  radius: 'default',
  scale: 'default',
  contentLayout: 'full',
}

export const THEME_PRESET_VALUES = new Set(
  THEME_PRESETS.map((p) => p.value)
) as ReadonlySet<ThemePreset>

export const THEME_FONT_VALUES: ReadonlySet<ThemeFont> = new Set([
  'default',
  'sans',
  'serif',
])

export const THEME_RADIUS_VALUES: ReadonlySet<ThemeRadius> = new Set([
  'default',
  'none',
  'sm',
  'md',
  'lg',
  'xl',
])

export const THEME_SCALE_VALUES: ReadonlySet<ThemeScale> = new Set([
  'default',
  'sm',
  'lg',
  'xl',
])

export const CONTENT_LAYOUT_VALUES: ReadonlySet<ContentLayout> = new Set([
  'full',
  'centered',
])

/**
 * Preset → default font mapping. Used by the provider to resolve the user's
 * `font: 'default'` preference against the active preset.
 *
 * Presets without a font override use the system sans-serif. Public
 * Sans is reserved for an explicit user choice. Empty while `default` is the
 * only preset.
 */
export const PRESET_DEFAULT_FONT: Partial<
  Record<ThemePreset, ResolvedThemeFont>
> = {}

/**
 * Resolve a user font preference + active preset into the concrete font that
 * should drive the DOM. Pure function so it's safe to call inside both the
 * effect that applies the attribute and the UI preview that hints at what
 * `default` will render as.
 */
export function resolveThemeFont(
  font: ThemeFont,
  preset: ThemePreset
): ResolvedThemeFont {
  if (font === 'default') {
    return PRESET_DEFAULT_FONT[preset] ?? 'system'
  }
  return font
}
