/**
 * Composable to toggle between light and dark Vuetify themes,
 * synced with OS/browser preference and toggleable by the user.
 * @returns Object with isDark which is a changeable ref object of type bool, toggle, which is a function
 * that toggles the theme from dark to light or vice versa.
 */
export function useCustomTheme() {
  const { $vuetify } = useNuxtApp();

  // SSR-safe persistent within a cookie
  const themeCookie = useCookie<"light" | "dark">("app-theme", {
    default: () => "light",
  });

  const isDark = computed<boolean>({
    get: () => themeCookie.value === "dark",
    set: (val) => {
      themeCookie.value = val ? "dark" : "light";
      $vuetify.theme.change(themeCookie.value);
    },
  });

  // Client-only system detection (runs once)
  if (process.client && !themeCookie.value) {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    themeCookie.value = prefersDark ? "dark" : "light";
    $vuetify.theme.change(themeCookie.value);
  }

  const toggle = (value?: boolean) => {
    isDark.value = value ?? !isDark.value;
    return isDark.value;
  };

  // React to system changes if the user hasn't overridden
  if (process.client) {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    media.addEventListener("change", (e) => {
      if (!themeCookie.value) {
        isDark.value = e.matches;
      }
    });
  }

  return { isDark, toggle };
}
