import { useDark, useToggle } from '@vueuse/core'

export function useCustomTheme() {
    const { $vuetify } = useNuxtApp()
    const prefersDark = true; //typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false

    const isDark = useDark({
        valueDark: 'dark',
        valueLight: 'light',
        initialValue: prefersDark ? 'dark' : 'light',
        onChanged: (dark: boolean) => {
            $vuetify.theme.global.name.value = dark ? 'dark' : 'light'
        },
    })

    const toggle = useToggle(isDark)

    return { isDark, toggle }
}