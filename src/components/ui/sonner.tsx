"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "dark" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      richColors
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--color-popover)",
          "--normal-text": "var(--color-popover-foreground)",
          "--normal-border": "var(--color-border)",
          "--success-bg": "#11351f",
          "--success-text": "#59f3a6",
          "--success-border": "rgba(89, 243, 166, 0.28)",
          "--warning-bg": "#3a2f00",
          "--warning-text": "#ffd54f",
          "--warning-border": "rgba(255, 213, 79, 0.28)",
          "--error-bg": "#41130c",
          "--error-text": "#ff8a80",
          "--error-border": "rgba(255, 138, 128, 0.28)",
          "--info-bg": "#0f2a3f",
          "--info-text": "#8ecaff",
          "--info-border": "rgba(142, 202, 255, 0.28)",
          "--border-radius": "var(--radius-md)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
