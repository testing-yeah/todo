"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProviderCompo({ children, ...props }) {
    return <NextThemesProvider {...props}> {children}</NextThemesProvider >
}
