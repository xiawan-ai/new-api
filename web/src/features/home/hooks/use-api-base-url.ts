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
import { useStatus } from '@/hooks/use-status'

/**
 * The address a buyer points their client at: the server address set in
 * System Settings > Site, else the origin this page is served from.
 */
export function useApiBaseUrl(): string {
  const { status } = useStatus()
  const configured =
    typeof status?.server_address === 'string'
      ? status.server_address.trim()
      : ''
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return (configured || origin).replace(/\/+$/, '')
}
