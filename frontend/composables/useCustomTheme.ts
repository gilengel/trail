import {useDark, useToggle} from '@vueuse/core'

/**
 * Composable to toggle between light and dark Vuetify themes,
 * synced with OS/browser preference and toggleable by the user.
 */
export function useCustomTheme(): {
    isDark: globalThis.WritableComputedRef<boolean, boolean>
    toggle: (value?: boolean | undefined) => boolean
} {
    const {$vuetify} = useNuxtApp()

    const prefersDark =
        typeof window !== 'undefined'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : false

    const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light',
        initialValue: prefersDark ? 'dark' : 'light',
        onChanged: (dark: boolean) => {
            if (typeof window !== 'undefined') {
                $vuetify.theme.global.name.value = dark ? 'dark' : 'light'
            }
        },
        storageKey: 'app-theme', // Optional: Persist in localStorage
    })

    const toggle = useToggle(isDark)

    // React to system theme changes
    if (typeof window !== 'undefined') {
        const media = window.matchMedia('(prefers-color-scheme: dark)')
        media.addEventListener('change', (e) => {
            isDark.value = e.matches
        })
    }

    return {isDark, toggle}
}
