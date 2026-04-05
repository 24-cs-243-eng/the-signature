import { createContext, useContext, useEffect, useState } from "react"

export type Theme = "dark" | "light" | "system"
export type DeviceType = "desktop" | "mobile"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultDesktopTheme?: Theme
  defaultMobileTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  desktopTheme: Theme
  mobileTheme: Theme
  activeTheme: Theme
  setTheme: (device: DeviceType, theme: Theme) => void
}

const initialState: ThemeProviderState = {
  desktopTheme: "system",
  mobileTheme: "system",
  activeTheme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultDesktopTheme = "system",
  defaultMobileTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [desktopTheme, setDesktopThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-desktop`) as Theme) || defaultDesktopTheme
  )
  const [mobileTheme, setMobileThemeState] = useState<Theme>(
    () => (localStorage.getItem(`${storageKey}-mobile`) as Theme) || defaultMobileTheme
  )

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024)
    handleResize() // init
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const currentThemeSetting = isMobile ? mobileTheme : desktopTheme

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (currentThemeSetting === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(currentThemeSetting)
  }, [currentThemeSetting])

  const setTheme = (device: DeviceType, theme: Theme) => {
    localStorage.setItem(`${storageKey}-${device}`, theme)
    if (device === "desktop") setDesktopThemeState(theme)
    else setMobileThemeState(theme)
  }

  const value = {
    desktopTheme,
    mobileTheme,
    activeTheme: currentThemeSetting,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}