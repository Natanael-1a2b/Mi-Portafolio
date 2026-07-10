import { useState, useEffect } from 'react'

export type DeviceMode = 'mobile' | 'desktop'

export function useDeviceMode(): DeviceMode {
  const [mode, setMode] = useState<DeviceMode>('desktop')

  useEffect(() => {
    const checkDeviceMode = () => {
      // 1. User-Agent Sniffing para intención del dispositivo
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)

      // 2. Viewport como fallback o para manejar redimensionamientos grandes
      const isMobileWidth = window.innerWidth < 768

      // Es móvil si el agente lo dice o si el ancho es muy pequeño
      setMode(isMobileAgent || isMobileWidth ? 'mobile' : 'desktop')
    }

    // Chequeo inicial
    checkDeviceMode()

    // Manejar redimensionamiento
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(checkDeviceMode, 150)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])

  return mode
}
