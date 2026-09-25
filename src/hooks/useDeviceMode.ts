import { useState, useEffect } from 'react'

export type DeviceMode = 'mobile' | 'desktop'

function detectMode(): DeviceMode {
  // 1. User-Agent Sniffing para intención del dispositivo
  const userAgent = navigator.userAgent.toLowerCase()
  const isMobileAgent = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent)

  // 2. Viewport como fallback o para manejar redimensionamientos grandes
  const isMobileWidth = window.innerWidth < 768

  // Es móvil si el agente lo dice o si el ancho es muy pequeño
  return isMobileAgent || isMobileWidth ? 'mobile' : 'desktop'
}

export function useDeviceMode(): DeviceMode {
  // Se calcula en el primer render para no montar la versión de escritorio en móviles
  const [mode, setMode] = useState<DeviceMode>(detectMode)

  useEffect(() => {
    // Manejar redimensionamiento
    let timer: ReturnType<typeof setTimeout>
    const onResize = () => {
      clearTimeout(timer)
      timer = setTimeout(() => setMode(detectMode()), 150)
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(timer)
    }
  }, [])

  return mode
}
